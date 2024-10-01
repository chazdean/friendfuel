import { FIRESTORE_DB } from "@/firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { updateStatsOnInteraction } from "./stats";

export interface MessageData {
  id: string;
  chatId: string;
  text: string;
  senderId: string;
  receiverId: string;
}
export interface MessageDataProps {
  chatId: string;
  text: string;
  senderId: string;
  receiverId: string;
}

export const addMessageToFirestore = async ({
  chatId,
  text,
  senderId,
  receiverId,
}: MessageDataProps) => {
  try {
    const messagesCollection = collection(FIRESTORE_DB, "messages");
    const chatRef = doc(FIRESTORE_DB, "chats", chatId);

    // Create the new message in Firestore
    const messageRef = await addDoc(messagesCollection, {
      chatId,
      text,
      senderId,
      receiverId,
      createdAt: new Date(),
    });

    await updateStatsOnInteraction(senderId, receiverId);

    // Get the current chat document
    const chatDoc = await getDoc(chatRef);
    const chatData = chatDoc.data();

    // Update the chat's responses object with the new response
    const updatedResponses = {
      ...(chatData?.responses || {}),
      [senderId]: true,
    };

    // Check if both participants have responded
    const bothResponded =
      Boolean(updatedResponses[senderId]) &&
      Boolean(updatedResponses[receiverId]);

    // Update chat document with responses, completed status, and set active to true
    await updateDoc(chatRef, {
      responses: updatedResponses,
      completed: bothResponded,
      active: true,
    });

    // Get receiver's Expo push token
    const receiverDoc = await getDoc(doc(FIRESTORE_DB, "users", receiverId));
    const receiverData = receiverDoc.data();

    if (receiverData?.expoPushToken) {
      // Get sender's name
      const senderDoc = await getDoc(doc(FIRESTORE_DB, "users", senderId));
      const senderData = senderDoc.data();
      const senderName = senderData?.username || "Someone";

      // Send push notification via Expo's push service
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: receiverData.expoPushToken,
          title: "friendfuel",
          body: `${senderName} has sent you a message`,
          data: {
            type: "NEW_MESSAGE",
            chatId,
            messageId: messageRef.id,
          },
        }),
      });
    }

    return messageRef;
  } catch (error: any) {
    console.error("Error sending message:", error);
    throw new Error(error.message);
  }
};

export const fetchMessagesFromFirestore = async (
  chatId: string
): Promise<MessageData[]> => {
  try {
    const messagesCollection = collection(FIRESTORE_DB, "messages");

    // Query messages where `chatId` matches and order by `createdAt`
    const q = query(
      messagesCollection,
      where("chatId", "==", chatId),
      orderBy("createdAt", "asc")
    );
    const messagesSnapshot = await getDocs(q);

    // Map Firestore docs to MessageData array
    const messages = messagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MessageData[];

    return messages;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
