import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../firebaseConfig";

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    senderId: string;
  };
  userId: string;
  userImage: string;
  friendImage: string;
}

export default function ChatMessage({
  message,
  userId,
  userImage,
  friendImage,
}: ChatMessageProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const isUserMessage = message.senderId === userId;

  const handleReport = async () => {
    try {
      const reportsRef = collection(FIRESTORE_DB, "reports");
      await addDoc(reportsRef, {
        messageId: message.id,
        reportedUserId: message.senderId,
        messageContent: message.text,
        reportedAt: new Date().toISOString(),
        reportedBy: userId,
        status: "pending",
      });

      Alert.alert(
        "Report Submitted",
        "Thank you for reporting this message. We will review it shortly.",
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to submit report. Please try again later.", [
        { text: "OK" },
      ]);
    }

    setModalVisible(false);
  };

  const handleLongPress = () => {
    if (!isUserMessage) {
      setModalVisible(true);
    }
  };

  return (
    <>
      <View
        className={`flex flex-row ${
          isUserMessage ? "flex-row-reverse" : ""
        } items-center gap-x-1 mb-4 w-full`}
      >
        <Image
          source={{ uri: isUserMessage ? userImage : friendImage }}
          className="w-12 h-12 rounded-full p-2 flex-shrink-0"
        />
        <View
          className={`flex-1 flex ${
            isUserMessage ? "items-end" : "items-start"
          }`}
        >
          <Pressable onLongPress={handleLongPress} className="flex-row">
            <View
              className={`${
                isUserMessage ? "bg-black" : "bg-gray-300"
              } p-4 rounded-lg self-start`}
              style={{
                borderTopRightRadius: isUserMessage ? 0 : 10,
                borderTopLeftRadius: isUserMessage ? 10 : 0,
              }}
            >
              <Text
                className={`${isUserMessage ? "text-white" : "text-black"}`}
              >
                {message.text}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      {!isUserMessage && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            className="flex-1 bg-black/50"
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View className="absolute bottom-0 w-full bg-white pb-4">
              <View className="p-4">
                <TouchableOpacity className="py-3" onPress={handleReport}>
                  <Text className="text-red-500 text-center text-lg font-semibold">
                    Report Message
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
}
