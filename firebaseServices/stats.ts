import { doc, getDoc, updateDoc, collection, setDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";

// Update stats on interaction between two users
export const updateStatsOnInteraction = async (
  userId: string,
  friendId: string
) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD format

    // Get or create streak document
    const streakDocRef = doc(FIRESTORE_DB, "streaks", userId);
    const streakSnap = await getDoc(streakDocRef);

    if (!streakSnap.exists()) {
      // Initialize streak document if it doesn't exist
      await setDoc(streakDocRef, {
        currentStreak: 1,
        lastStreakDate: today,
        streakHistory: {
          [todayStr]: { completed: true },
        },
      });
    } else {
      const streakData = streakSnap.data();
      const lastDate = streakData.lastStreakDate.toDate();
      lastDate.setHours(0, 0, 0, 0);

      if (lastDate.getTime() === today.getTime()) {
        // Already logged today, no update needed
        console.log("Already interacted today. Streak remains the same.");
      } else if (today.getTime() - lastDate.getTime() === 86400000) {
        // Consecutive day - increment streak
        await updateDoc(streakDocRef, {
          currentStreak: (streakData.currentStreak || 0) + 1,
          lastStreakDate: today,
          [`streakHistory.${todayStr}`]: { completed: true },
        });
      } else {
        // Non-consecutive day - reset streak
        await updateDoc(streakDocRef, {
          currentStreak: 1,
          lastStreakDate: today,
          [`streakHistory.${todayStr}`]: { completed: true },
        });
      }
    }

    // Fetch friend-specific stats from Firestore
    const statsCollection = collection(FIRESTORE_DB, "userFriendStats");
    const statsDocRef = doc(statsCollection, `${userId}_${friendId}`);
    const statsSnap = await getDoc(statsDocRef);

    if (!statsSnap.exists()) {
      // Create new stats for this friendship if they don't exist
      await setDoc(statsDocRef, {
        user: userId,
        friend: friendId,
        streakWithFriend: 1,
        chatsAnswered: 1,
        lastInteractionDateWithFriend: today,
      });
    } else {
      const statsData = statsSnap.data();
      const lastFriendInteractionDate =
        statsData?.lastInteractionDateWithFriend?.toDate() || null;

      // Streak with Friend Logic
      if (lastFriendInteractionDate) {
        const lastDate = new Date(lastFriendInteractionDate);
        lastDate.setHours(0, 0, 0, 0); // Normalize to midnight

        if (lastDate.getTime() === today.getTime()) {
          // Only increment chatsAnswered if already interacted today
          await updateDoc(statsDocRef, {
            chatsAnswered: (statsData?.chatsAnswered || 0) + 1,
          });
        } else if (today.getTime() - lastDate.getTime() === 86400000) {
          // Increment both streak and chats for consecutive days
          await updateDoc(statsDocRef, {
            streakWithFriend: (statsData?.streakWithFriend || 0) + 1,
            chatsAnswered: (statsData?.chatsAnswered || 0) + 1,
            lastInteractionDateWithFriend: today,
          });
        } else {
          // Reset streak but still increment chats for non-consecutive days
          await updateDoc(statsDocRef, {
            streakWithFriend: 1,
            chatsAnswered: (statsData?.chatsAnswered || 0) + 1,
            lastInteractionDateWithFriend: today,
          });
        }
      } else {
        // Initial interaction remains the same
        await updateDoc(statsDocRef, {
          streakWithFriend: 1,
          chatsAnswered: 1,
          lastInteractionDateWithFriend: today,
        });
      }
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};
