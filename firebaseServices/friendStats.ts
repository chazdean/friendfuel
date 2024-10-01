import { doc, getDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";

export interface FriendStats {
  chatsAnswered: number;
  streakWithFriend: number;
  lastInteractionDateWithFriend: Date | null;
  friend: string;
  user: string;
}

export const fetchFriendStatsFromFirestore = async (
  userId: string,
  friendId: string
): Promise<FriendStats | null> => {
  try {
    const statsDocRef = doc(
      FIRESTORE_DB,
      "userFriendStats",
      `${userId}_${friendId}`
    );
    const statsSnapshot = await getDoc(statsDocRef);

    if (!statsSnapshot.exists()) {
      return null;
    }

    const statsData = statsSnapshot.data();

    return {
      chatsAnswered: statsData.chatsAnswered,
      streakWithFriend: statsData.streakWithFriend,
      lastInteractionDateWithFriend:
        statsData.lastInteractionDateWithFriend?.toDate() || null,
      friend: statsData.friend,
      user: statsData.user,
    } as FriendStats;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
