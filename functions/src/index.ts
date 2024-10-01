/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { scheduler } from "firebase-functions/v2";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
import { Expo, ExpoPushMessage } from "expo-server-sdk";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

// Initialize Firebase Admin
initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.json({ message: "Hello from Firebase!" });
});

// New streak checking function
export const checkStreaks = scheduler.onSchedule(
  {
    schedule: "0 0 * * *",
    timeZone: "UTC",
    retryCount: 3,
  },
  async () => {
    const db = getFirestore();
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    try {
      // Get all streaks
      const streaksSnapshot = await db.collection("streaks").get();
      const batch = db.batch();

      streaksSnapshot.forEach((doc) => {
        const data = doc.data();
        const lastDate = data.lastStreakDate.toDate();
        const diffHours = Math.floor(
          (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60)
        );

        // If more than 24 hours have passed, reset streak
        if (diffHours >= 24) {
          batch.update(doc.ref, {
            currentStreak: 0,
            streakHistory: {
              ...data.streakHistory,
              [now.toISOString().split("T")[0]]: { completed: false },
            },
          });

          logger.info(`Resetting streak for user ${doc.id}`);
        }
      });

      await batch.commit();
      logger.info("Streak check completed successfully");
    } catch (error) {
      logger.error("Error checking streaks:", error);
      throw error;
    }
  }
);

export const testStreakCheck = onRequest(async (request, response) => {
  try {
    const mockSchedulerEvent = {
      scheduleTime: new Date().toISOString(),
      retry: false,
    };

    await checkStreaks.run(mockSchedulerEvent);
    response.json({ message: "Streak check completed successfully" });
  } catch (error) {
    logger.error("Manual streak check error:", error);
    response.status(500).json({
      error: `Error during streak check: ${(error as Error).message}`,
    });
  }
});

const expo = new Expo();

export const checkStreaksAndNotify = scheduler.onSchedule(
  {
    schedule: "0 */4 * * *",
    timeZone: "UTC",
    retryCount: 3,
  },
  async () => {
    const db = getFirestore();
    const now = new Date();

    try {
      const streaksSnapshot = await db.collection("streaks").get();
      const messages: ExpoPushMessage[] = [];

      for (const doc of streaksSnapshot.docs) {
        const data = doc.data();
        const lastDate = data.lastStreakDate.toDate();
        const diffHours = Math.floor(
          (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60)
        );

        // If approaching 24 hours (between 20-23 hours)
        if (diffHours >= 20 && diffHours < 24) {
          // Get user's push token
          const userDoc = await db.collection("users").doc(doc.id).get();
          const pushToken = userDoc.data()?.expoPushToken;

          if (pushToken && Expo.isExpoPushToken(pushToken)) {
            messages.push({
              to: pushToken,
              sound: "default" as const,
              body: `Your streak will end in ${24 - diffHours} hours!`,
              data: { type: "STREAK_WARNING" },
            });
          }
        }
      }

      // Send notifications in chunks
      const chunks = expo.chunkPushNotifications(messages);
      for (const chunk of chunks) {
        try {
          await expo.sendPushNotificationsAsync(chunk);
        } catch (error) {
          logger.error("Error sending notifications:", error);
        }
      }

      logger.info("Notification check completed successfully");
    } catch (error) {
      logger.error("Error checking notifications:", error);
      throw error;
    }
  }
);

export const testStreakNotifications = onRequest(async (request, response) => {
  try {
    const mockSchedulerEvent = {
      scheduleTime: new Date().toISOString(),
      retry: false,
    };

    await checkStreaksAndNotify.run(mockSchedulerEvent);
    response.json({ message: "Streak notifications completed successfully" });
  } catch (error) {
    logger.error("Manual notification test error:", error);
    response.status(500).json({
      error: `Error during notification check: ${(error as Error).message}`,
    });
  }
});

export const checkFriendStreaks = scheduler.onSchedule(
  {
    schedule: "0 0 * * *",
    timeZone: "UTC",
    retryCount: 3,
  },
  async () => {
    const db = getFirestore();
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    try {
      const userFriendStatsSnapshot = await db
        .collection("userFriendStats")
        .get();
      const batch = db.batch();

      userFriendStatsSnapshot.forEach((doc) => {
        const data = doc.data();
        const lastInteraction = data.lastInteractionDateWithFriend?.toDate();

        if (lastInteraction) {
          const diffHours = Math.floor(
            (now.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60)
          );

          // Reset streak if more than 24 hours have passed
          if (diffHours >= 24) {
            batch.update(doc.ref, {
              streakWithFriend: 0,
            });

            logger.info(
              `Resetting friend streak for users ${data.user} and ${data.friend}`
            );
          }
        }
      });

      await batch.commit();
      logger.info("Friend streak check completed successfully");
    } catch (error) {
      logger.error("Error checking friend streaks:", error);
      throw error;
    }
  }
);

export const onFriendRequestCreated = onDocumentCreated(
  "friendRequests/{requestId}",
  async (event) => {
    const friendRequest = event.data?.data();
    if (!friendRequest || friendRequest.status !== "pending") return;

    const db = getFirestore();

    try {
      // Get the recipient's push token
      const recipientDoc = await db
        .collection("users")
        .doc(friendRequest.to)
        .get();
      const recipientData = recipientDoc.data();
      const pushToken = recipientData?.expoPushToken;

      // Get the sender's name
      const senderDoc = await db
        .collection("users")
        .doc(friendRequest.from)
        .get();
      const senderData = senderDoc.data();
      const senderName = senderData?.name || senderData?.username || "Someone";

      if (pushToken && Expo.isExpoPushToken(pushToken)) {
        const message: ExpoPushMessage = {
          to: pushToken,
          sound: "default",
          title: "New Friend Request",
          body: `${senderName} sent you a friend request!`,
          data: {
            type: "FRIEND_REQUEST",
            requestId: event.data?.id,
            senderId: friendRequest.from,
          },
        };

        await expo.sendPushNotificationsAsync([message]);
      }
    } catch (error) {
      logger.error("Error sending friend request notification:", error);
    }
  }
);
