import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { doc, setDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";
import { useAuth } from "@/context/authContext";

// Configure how notifications are displayed when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotifications() {
  const { user } = useAuth();
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    if (!user) return;

    async function registerForPushNotifications() {
      // Request permission
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return;
      }

      // Get the token
      const expoPushToken = await Notifications.getExpoPushTokenAsync({
        projectId: "2713535c-a6fb-4c64-a41f-9954ad8212a4",
      });

      // Save the token to Firestore
      await setDoc(
        doc(FIRESTORE_DB, "users", user!.uid),
        {
          expoPushToken: expoPushToken.data,
        },
        { merge: true }
      );

      // Required for Android
      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    }

    registerForPushNotifications();

    // Listen for incoming notifications while app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        const data = notification.request.content.data;
        if (data.type === "FRIEND_REQUEST") {
          // Handle the friend request notification
          console.log(
            "Friend request received:",
            notification.request.content.body
          );
        } else if (data.type === "STREAK_WARNING") {
          // Handle the streak warning notification
          console.log(
            "Streak warning received:",
            notification.request.content.body
          );
        } else if (data.type === "NEW_MESSAGE") {
          // Handle the new message notification
          console.log(
            "New message received:",
            notification.request.content.body
          );
        }
      });

    // Listen for user interaction with notifications
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        if (data.type === "FRIEND_REQUEST") {
          // Handle user tapping on the friend request notification
          // You could navigate them to the friend requests screen
          // navigation.navigate('FriendRequests');
        } else if (data.type === "STREAK_WARNING") {
          // Handle user tapping on the streak warning notification
        } else if (data.type === "NEW_MESSAGE") {
          // Handle user tapping on the message notification
          // You could navigate them to the specific chat
          // navigation.navigate('Chat', { chatId: data.chatId });
        }
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [user]);
}
