import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  DocumentReference,
  addDoc,
} from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";
import { ChatData, Participant, Question } from "@/types/types";
import { AuthenticatedUser } from "@/context/authContext";

// Fetch a single chat by its ID
export const fetchChatById = async (
  chatId: string
): Promise<ChatData | null> => {
  try {
    // Fetch chat data
    const chatDocRef = doc(FIRESTORE_DB, "chats", chatId);
    const chatSnap = await getDoc(chatDocRef);

    if (!chatSnap.exists()) {
      throw new Error("Chat not found");
    }

    const chatData = chatSnap.data();
    if (!chatData) return null;

    // Fetch question and participants in parallel
    const [questionSnap, ...participantSnaps] = await Promise.all([
      getDoc(doc(FIRESTORE_DB, "questions", chatData.questionId)),
      ...chatData.participantIds.map((participantId: string) =>
        getDoc(doc(FIRESTORE_DB, "users", participantId))
      ),
    ]);

    // Only fetch the fields we need from question
    const questionData = questionSnap.data();
    const participants = participantSnaps.map((participantSnap) => {
      const participantData = participantSnap.data() as AuthenticatedUser;
      return {
        id: participantSnap.id,
        name: participantData.name,
        username: participantData.username,
        image: participantData.profileUrl,
      } as Participant;
    });

    return {
      id: chatSnap.id,
      questionId: chatData.questionId,
      participants,
      completed: chatData.completed,
      createdAt: chatData.createdAt.toDate(),
      active: chatData.active,
      question: {
        text: questionData?.text,
        thumbnail: questionData?.thumbnail,
      },
      responses: chatData.responses,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Fetch all chats for a specific user
export const fetchChatsForUser = async (
  userId: string
): Promise<ChatData[]> => {
  try {
    const chatsCollection = collection(FIRESTORE_DB, "chats");
    const q = query(
      chatsCollection,
      where("participantIds", "array-contains", userId),
      where("active", "==", true)
    );
    const chatsSnapshot = await getDocs(q);

    const chats = await Promise.all(
      chatsSnapshot.docs.map(async (docSnap) => {
        const chatData = docSnap.data();

        // Fetch the question document for each chat
        const questionDocRef = doc(
          FIRESTORE_DB,
          "questions",
          chatData.questionId
        );
        const questionSnap = await getDoc(questionDocRef);
        const questionData: Question = {
          ...(questionSnap.data() as Question),
        };

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
      })
    );

    return chats;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createChatInFirestore = async (
  questionId: string,
  participantIds: string[]
): Promise<string> => {
  try {
    // Verify that the question exists
    const questionDocRef = doc(FIRESTORE_DB, "questions", questionId);
    const questionSnap = await getDoc(questionDocRef);

    if (!questionSnap.exists()) {
      throw new Error("Question not found");
    }

    // Create the chat document in Firestore
    const chatDocRef = await addDoc(collection(FIRESTORE_DB, "chats"), {
      questionId,
      participantIds,
      completed: false,
      active: false,
      createdAt: new Date(),
      responses: {} as Record<string, boolean>,
    });

    return chatDocRef.id; // Return the newly created chat's ID
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const fetchExistingChat = async (
  questionId: string,
  participantIds: string[]
): Promise<string | null> => {
  try {
    // Query the chats collection where questionId matches
    const chatsCollection = collection(FIRESTORE_DB, "chats");
    const q = query(chatsCollection, where("questionId", "==", questionId));
    const chatsSnapshot = await getDocs(q);

    // Iterate over each chat to see if the participants match
    const existingChat = chatsSnapshot.docs.find((doc) => {
      const chatData = doc.data() as ChatData;

      // Extract participant IDs from the chat data's participants array
      const chatParticipantIds = chatData.participants.map(
        (participant: Participant) => participant.id
      );

      // Check if all provided participantIds are included in the chat participants
      return participantIds.every((id) => chatParticipantIds.includes(id));
    });

    return existingChat ? existingChat.id : null;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
