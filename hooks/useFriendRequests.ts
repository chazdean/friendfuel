import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { FriendRequest } from "@/types/types";
import { fetchFriendRequests } from "@/firebaseServices/friendRequest";
import { useAuth } from "@/context/authContext";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";

export default function useFriendRequests() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const friendRequestsCollection = collection(FIRESTORE_DB, "friendRequests");
    const q = query(
      friendRequestsCollection,
      where("to", "==", user.uid),
      where("status", "==", "pending")
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const requestPromises = snapshot.docs.map(async (friendRequestDoc) => {
          const friendRequestData = friendRequestDoc.data();

          const fromUserRef = doc(
            FIRESTORE_DB,
            "users",
            friendRequestData.from
          );
          const fromUserSnap = await getDoc(fromUserRef);
          const fromUserData = fromUserSnap.data();

          if (!fromUserSnap.exists() || !fromUserData) {
            console.error(
              `User data not found for ID ${friendRequestData.from}`
            );
            return null;
          }

          return {
            id: friendRequestDoc.id,
            from: {
              id: fromUserSnap.id,
              username: fromUserData.username,
              name: fromUserData.name,
              email: fromUserData.email,
              image: fromUserData.profileUrl || "",
            },
            to: friendRequestData.to,
            status: friendRequestData.status,
            createdAt: friendRequestData.createdAt.toDate(),
          } as FriendRequest;
        });

        const requests = (await Promise.all(requestPromises)).filter(
          (request): request is FriendRequest => request !== null
        );

        queryClient.setQueryData(["friendRequests", user.uid], requests);
      },
      (error) => {
        console.error("Error in friend requests listener:", error);
      }
    );

    return () => unsubscribe();
  }, [user, queryClient]);

  const {
    data: friendRequests,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["friendRequests", user?.uid],
    queryFn: () => fetchFriendRequests(user!.uid),
    enabled: !!user,
    staleTime: Infinity,
  });

  return {
    friendRequests: friendRequests as FriendRequest[],
    isLoading,
    error,
  };
}
