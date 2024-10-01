import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  onSnapshot,
  query,
  where,
  collection,
  doc,
  getDoc,
  DocumentReference,
} from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";
import { fetchChatsForUser } from "@/firebaseServices/chats";
import { ChatData, Chat, Question, Participant } from "@/types/types";

export function useChats(userId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const chatsCollection = collection(FIRESTORE_DB, "chats");
    const q = query(
      chatsCollection,
      where("participantIds", "array-contains", userId),
      where("active", "==", true)
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        // Transform the snapshot data into full chat objects
        const chatPromises = snapshot.docs.map(async (docSnap) => {
          const chatData = docSnap.data();

          // Fetch question data
          const questionDocRef = doc(
            FIRESTORE_DB,
            "questions",
            chatData.questionId
          );
          const questionSnap = await getDoc(questionDocRef);
          const questionData = questionSnap.data() as Question;

          // Fetch participant data
          const participantRefs = chatData.participantIds.map(
            (participantId: string) => doc(FIRESTORE_DB, "users", participantId)
          );
          const participants = await Promise.all(
            participantRefs.map(async (participantRef: DocumentReference) => {
              const participantSnap = await getDoc(participantRef);
              const participantData = participantSnap.data() as Participant;

              return {
                id: participantSnap.id,
                name: participantData.name,
                image: participantData.image,
              } as Participant;
            })
          );

          return {
            id: docSnap.id,
            questionId: chatData.questionId,
            participants,
            completed: chatData.completed,
            createdAt: chatData.createdAt,
            active: chatData.active,
            question: {
              text: questionData.text,
              thumbnail: questionData.thumbnail,
            },
            responses: chatData.responses,
          } as ChatData;
        });

        // Wait for all promises to resolve
        const fullChatData = await Promise.all(chatPromises);

        queryClient.setQueryData(
          ["chatData", userId],
          (existingData: Chat[] = []) => {
            return fullChatData.map((newData) => {
              const existingChat = existingData?.find(
                (chat) => chat.id === newData.id
              );
              return existingChat ? { ...existingChat, ...newData } : newData;
            });
          }
        );
      },
      (error) => {
        console.error("Error fetching real-time data:", error);
      }
    );

    return () => unsubscribe();
  }, [userId, queryClient]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["chatData", userId],
    queryFn: () => fetchChatsForUser(userId),
    staleTime: Infinity, // Trust real-time data, so staleTime is set to Infinity
  });

  return { chats: data, loading: isLoading, error };
}
