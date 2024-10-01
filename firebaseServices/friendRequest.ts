import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";
import { FriendRequest } from "@/types/types";

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  image: string;
}

// Fetch friend requests received by the current user

export const fetchFriendRequests = async (
  userId: string
): Promise<FriendRequest[]> => {
  try {
    const friendRequestsCollection = collection(FIRESTORE_DB, "friendRequests");

    // Query to get all friend requests where `to` is the current user's ID
    const q = query(friendRequestsCollection, where("to", "==", userId));
    const friendRequestsSnapshot = await getDocs(q);

    // Map over friend requests to include full `from` user object
    const friendRequests = await Promise.all(
      friendRequestsSnapshot.docs.map(async (friendRequestDoc) => {
        const friendRequestData = friendRequestDoc.data();

        // Fetch the full user object for the `from` field from Firestore
        const fromUserRef = doc(FIRESTORE_DB, "users", friendRequestData.from);
        const fromUserSnap = await getDoc(fromUserRef);

        if (!fromUserSnap.exists()) {
          throw new Error(`User with ID ${friendRequestData.from} not found`);
        }

        // Safely handle undefined data and cast it to the expected User type
        const fromUserData = fromUserSnap.data();
        if (!fromUserData) {
          throw new Error(
            `No data found for user with ID ${friendRequestData.from}`
          );
        }

        // Construct the full user object for `from`
        const fromUser: User = {
          id: fromUserSnap.id,
          username: fromUserData.username,
          name: fromUserData.name,
          email: fromUserData.email,
          image: fromUserData.profileUrl || "",
        };

        // Return the full friend request object, with the `from` field populated
        return {
          id: friendRequestDoc.id, // Renamed from `doc` to avoid conflict
          from: fromUser, // Full user object for the `from` field
          to: friendRequestData.to,
          status: friendRequestData.status,
          createdAt: friendRequestData.createdAt.toDate(), // Convert Firestore Timestamp to Date
        } as FriendRequest;
      })
    );

    return friendRequests;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const acceptFriendRequestInFirestore = async (
  requestId: string
): Promise<void> => {
  const friendRequestDocRef = doc(FIRESTORE_DB, "friendRequests", requestId);
  const friendRequestSnap = await getDoc(friendRequestDocRef);

  if (!friendRequestSnap.exists()) {
    throw new Error("Friend request not found");
  }

  const friendRequestData = friendRequestSnap.data();
  const { from: userFromId, to: userToId } = friendRequestData;

  // Update the status of the friend request to "accepted"
  await updateDoc(friendRequestDocRef, {
    status: "accepted",
  });

  // Add users to each other's friend lists
  const userFromDocRef = doc(FIRESTORE_DB, "users", userFromId);
  const userToDocRef = doc(FIRESTORE_DB, "users", userToId);

  await Promise.all([
    updateDoc(userFromDocRef, {
      friends: [
        ...((await getDoc(userFromDocRef)).data()?.friends || []),
        userToId,
      ],
    }),
    updateDoc(userToDocRef, {
      friends: [
        ...((await getDoc(userToDocRef)).data()?.friends || []),
        userFromId,
      ],
    }),
  ]);

  // Create initial stats for both users
  const userFromStatsRef = collection(FIRESTORE_DB, "userFriendStats");
  const userToStatsRef = collection(FIRESTORE_DB, "userFriendStats");

  await Promise.all([
    addDoc(userFromStatsRef, {
      user: userFromId,
      friend: userToId,
      chatsAnswered: 0,
      streakWithFriend: 0,
      lastInteractionDateWithFriend: null,
    }),
    addDoc(userToStatsRef, {
      user: userToId,
      friend: userFromId,
      chatsAnswered: 0,
      streakWithFriend: 0,
      lastInteractionDateWithFriend: null,
    }),
  ]);
};

// Decline friend request
export const declineFriendRequestInFirestore = async (
  requestId: string
): Promise<void> => {
  const friendRequestDocRef = doc(FIRESTORE_DB, "friendRequests", requestId);
  const friendRequestSnap = await getDoc(friendRequestDocRef);

  if (!friendRequestSnap.exists()) {
    throw new Error("Friend request not found");
  }

  // Update the status of the friend request to "declined"
  await updateDoc(friendRequestDocRef, {
    status: "declined",
  });
};

export const sendFriendRequestInFirestore = async (
  username: string,
  fromUserId: string
): Promise<FriendRequest> => {
  try {
    // Check the user's current friend count
    const fromUserRef = doc(FIRESTORE_DB, "users", fromUserId);
    const fromUserSnap = await getDoc(fromUserRef);
    const fromUserData = fromUserSnap.data();
    const currentFriends = fromUserData?.friends || [];

    if (currentFriends.length >= 3) {
      throw new Error(
        "You have reached the maximum limit of 3 friends on your account"
      );
    }

    // Query to find the target user by username
    const usersCollection = collection(FIRESTORE_DB, "users");
    const q = query(usersCollection, where("username", "==", username));
    const targetUserSnapshot = await getDocs(q);

    if (targetUserSnapshot.empty) {
      throw new Error("Target user not found");
    }

    const targetUserDoc = targetUserSnapshot.docs[0];
    const targetUserId = targetUserDoc.id;

    // Check if the friend request already exists
    const friendRequestsCollection = collection(FIRESTORE_DB, "friendRequests");
    const existingRequestQuery = query(
      friendRequestsCollection,
      where("from", "==", fromUserId),
      where("to", "==", targetUserId)
    );
    const existingRequestSnapshot = await getDocs(existingRequestQuery);

    if (!existingRequestSnapshot.empty) {
      throw new Error("Friend request already sent");
    }

    // Create the friend request document
    const friendRequestRef = await addDoc(friendRequestsCollection, {
      from: fromUserId,
      to: targetUserId,
      status: "pending",
      createdAt: new Date(),
    });

    // Update the target user's document to include the friend request
    const targetUserRef = doc(FIRESTORE_DB, "users", targetUserId);
    await updateDoc(targetUserRef, {
      friendRequests: [
        ...(targetUserDoc.data().friendRequests || []),
        friendRequestRef.id,
      ],
    });

    // Return the friend request data
    const friendRequest = await getDoc(friendRequestRef);
    return { id: friendRequest.id, ...friendRequest.data() } as FriendRequest;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
