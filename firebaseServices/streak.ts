import { doc, getDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";

interface StreakData {
  currentStreak: number;
  lastStreakDate: Date;
  streakHistory: {
    [date: string]: { completed: boolean };
  };
}

// Fetch the user's streak data from Firestore
export const fetchPersonalStreakFromFirestore = async (
  userId: string
): Promise<StreakData | null> => {
  try {
    const streakDocRef = doc(FIRESTORE_DB, "streaks", userId);
    const streakSnap = await getDoc(streakDocRef);

    if (!streakSnap.exists()) {
      return {
        currentStreak: 0,
        lastStreakDate: new Date(),
        streakHistory: {},
      };
    }

    const streakData = streakSnap.data();
    return {
      currentStreak: streakData.currentStreak || 0,
      lastStreakDate: streakData.lastStreakDate.toDate(),
      streakHistory: streakData.streakHistory || {},
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
