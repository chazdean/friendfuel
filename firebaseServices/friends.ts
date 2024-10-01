import {
  doc,
  getDoc,
  writeBatch,
  arrayRemove,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";
import { Friend } from "@/types/types";

// Fetch friends of the current user
export const fetchFriendsFromFirestore = async (
  userId: string
): Promise<Friend[]> => {
  try {
    // Get the user's document from Firestore
    const userDocRef = doc(FIRESTORE_DB, "users", userId);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      throw new Error("User not found");
    }

    const userData = userSnap.data();
    const friendIds: string[] = userData?.friends || [];

    // Fetch each friend's data based on the friend IDs
    const friends = await Promise.all(
      friendIds.map(async (friendId) => {
        const friendDocRef = doc(FIRESTORE_DB, "users", friendId);
        const friendSnap = await getDoc(friendDocRef);

        if (friendSnap.exists()) {
          const friendData = friendSnap.data();
          return {
            id: friendSnap.id,
            name: friendData?.name,
            username: friendData?.username,
            email: friendData?.email,
            image: friendData?.profileUrl,
          } as Friend;
        }
      })
    );

    // Filter out any undefined values in case some friend documents are missing
    return friends.filter(Boolean) as Friend[];
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteFriend = async (
  userId: string,
  friendId: string
): Promise<void> => {
  try {
    const userDocRef = doc(FIRESTORE_DB, "users", userId);
    const friendDocRef = doc(FIRESTORE_DB, "users", friendId);

    // Get the chat document ID (assuming it's a combination of both user IDs)
    const chatId = [userId, friendId].sort().join("_");
    const chatDocRef = doc(FIRESTORE_DB, "chats", chatId);

    // Get the userFriendStats document references
    const userStatsRef = doc(
      FIRESTORE_DB,
      "userFriendStats",
      `${userId}_${friendId}`
    );
    const friendStatsRef = doc(
      FIRESTORE_DB,
      "userFriendStats",
      `${friendId}_${userId}`
    );

    // Query for the accepted friend request between these users
    const friendRequestsCollection = collection(FIRESTORE_DB, "friendRequests");
    const requestsQuery = query(
      friendRequestsCollection,
      where("status", "==", "accepted"),
      where("from", "in", [userId, friendId]),
      where("to", "in", [userId, friendId])
    );
    const requestsSnapshot = await getDocs(requestsQuery);

    // Batch all operations
    const batch = writeBatch(FIRESTORE_DB);

    // Remove friend from user's friends array
    batch.update(userDocRef, {
      friends: arrayRemove(friendId),
    });

    // Remove user from friend's friends array
    batch.update(friendDocRef, {
      friends: arrayRemove(userId),
    });

    // Delete the chat document
    batch.delete(chatDocRef);

    // Delete both userFriendStats documents
    batch.delete(userStatsRef);
    batch.delete(friendStatsRef);

    // Delete the accepted friend request
    requestsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Commit the batch
    await batch.commit();
  } catch (error: any) {
    throw new Error(`Failed to delete friend: ${error.message}`);
  }
};
