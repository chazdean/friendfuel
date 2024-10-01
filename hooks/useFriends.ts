import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Friend } from "@/types/types";
import { fetchFriendsFromFirestore } from "@/firebaseServices/friends";
import { useAuth } from "@/context/authContext";
import { doc, onSnapshot } from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";

export default function useFriends() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    // Listen to changes in the user's document where friends array is stored
    const userDocRef = doc(FIRESTORE_DB, "users", user.uid);

    const unsubscribe = onSnapshot(
      userDocRef,
      async (docSnapshot) => {
        if (docSnapshot.exists()) {
          // Use the existing service function to fetch and transform the data
          const friends = await fetchFriendsFromFirestore(user.uid);
          queryClient.setQueryData(["friends", user.uid], friends);
        }
      },
      (error) => {
        console.error("Error in friends listener:", error);
      }
    );

    return () => unsubscribe();
  }, [user, queryClient]);

  const {
    data: friends,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["friends", user?.uid],
    queryFn: () => fetchFriendsFromFirestore(user!.uid),
    enabled: !!user,
    staleTime: Infinity,
  });

  return { friends: friends as Friend[], isLoading, error };
}
