import { useAuth } from "@/context/authContext";
import ContentLoader, {
  Rect,
  Circle,
  Facebook,
} from "react-content-loader/native";
import { useChatData } from "@/hooks/useChatData";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import useAddMessage from "@/hooks/useAddMessage";
import useMessages from "@/hooks/useMessages";
import ChatMessage from "@/components/ChatMessage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Chat() {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.uid as string;
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  const { chatData, isLoading, error } = useChatData(chatId);
  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    refetch: refetchMessages,
  } = useMessages(chatId);
  const { addMessage } = useAddMessage();
  const [message, setMessage] = useState<string>("");
  const [localHasResponded, setLocalHasResponded] = useState(false);
  const [localIsComplete, setLocalIsComplete] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Identify the friend from the participants array
  const friend = chatData?.participants.find(
    (participant) => participant.id !== userId
  );

  // Add this helper function to check if user has responded
  const hasUserResponded =
    localHasResponded || chatData?.responses?.[userId] === true;
  const isChatComplete = localIsComplete || chatData?.completed;

  const handleSendMessage = async () => {
    if (message.trim()) {
      setIsSending(true);
      try {
        await addMessage({
          chatId,
          text: message,
          senderId: userId,
          receiverId: friend?.id as string,
        });
        setMessage(""); // Clear input after sending
        setLocalHasResponded(true); // Update local response status

        // If the other person has already responded, sending our message completes the chat
        if (friend?.id && chatData?.responses?.[friend.id]) {
          setLocalIsComplete(true);
        }

        refetchMessages(); // Refresh the messages
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const ImageLoader = () => (
    <ContentLoader
      viewBox="0 0 40 40"
      width={40}
      height={40}
      backgroundColor="#d1d5db"
      foregroundColor="#9ca3af"
    >
      <Circle cx="20" cy="20" r="20" />
    </ContentLoader>
  );

  const TextLoader = () => (
    <ContentLoader
      viewBox="0 0 250 40"
      width={200}
      height={40}
      backgroundColor="#d1d5db"
      foregroundColor="#9ca3af"
    >
      <Rect x="0" y="0" rx="4" ry="4" width="250" height="17" />
      <Rect x="0" y="30" rx="4" ry="4" width="167" height="17" />
    </ContentLoader>
  );

  // Render the main UI regardless of loading state
  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 h-full"
      style={{ backgroundColor: "#E5E7EB" }}
    >
      <View className="flex flex-column bg-gray-200 pt-6 justify-between h-full">
        {/* Back button and header always visible */}
        <Pressable
          onPress={() => {
            router.push("/(inbox)");
          }}
          className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mb-2 ml-6"
        >
          <Ionicons name="close-outline" size={24} color="black" />
        </Pressable>

        {/* Show skeleton or actual content */}
        <View className="flex flex-row items-center justify-between pb-6 bg-gray-200 px-6">
          <View className="w-[65%]">
            {isLoading ? (
              <TextLoader />
            ) : (
              <Text className="text-xl font-semibold">
                {chatData?.question.text}
              </Text>
            )}
          </View>
          <View className="flex flex-row items-center gap-x-2">
            {isLoading ? (
              <>
                <ImageLoader />
                <Ionicons name="infinite-outline" size={24} color="black" />
                <ImageLoader />
              </>
            ) : (
              <>
                <Image
                  source={{ uri: user?.profileUrl || "placeholder-url" }}
                  className="w-12 h-12 rounded-full"
                  style={{ width: 40, height: 40 }}
                />
                <Ionicons name="infinite-outline" size={24} color="black" />
                <Image
                  source={{ uri: friend?.image || "placeholder-url" }}
                  className="w-12 h-12 rounded-full"
                  style={{ width: 40, height: 40 }}
                />
              </>
            )}
          </View>
        </View>

        {/* Messages list with placeholder or real data */}
        <View className="flex-1 flex-col bg-white">
          <FlatList
            data={messages || []} // Fall back to empty array if loading
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChatMessage
                message={item}
                userId={user?.uid as string}
                userImage={user?.profileUrl as string}
                friendImage={friend?.image as string}
              />
            )}
            className="flex pb-4 px-6 pt-6"
          />
        </View>

        {/* Input section with KeyboardAvoidingView */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "position" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 45 : 0}
        >
          {isChatComplete ? (
            <View className="w-full px-6 py-4 bg-white pb-10 flex-row items-center justify-center gap-x-2">
              <Ionicons name="checkmark-circle" size={20} color="green" />
              <Text className="text-center text-gray-600">
                Congratulations! You've both completed this conversation.
              </Text>
            </View>
          ) : !hasUserResponded ? (
            <View className="flex flex-row items-center w-full px-6 py-2 bg-white pb-10">
              <TextInput
                className="flex-1 border border-gray-300 rounded-lg min-h-[50px] max-h-[200px] bg-white p-4"
                placeholder="Add your answer..."
                value={message}
                onChangeText={setMessage}
                textAlignVertical="top"
                multiline
              />
              <Pressable
                className={`ml-2 px-4 py-2 rounded-full ${
                  message.trim() && !isSending ? "bg-black" : "bg-gray-300"
                }`}
                onPress={handleSendMessage}
                disabled={!message.trim() || isSending}
              >
                <Text className="text-white">
                  {isSending ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    "Send"
                  )}
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="w-full px-6 py-4 bg-white pb-10">
              <Text className="text-center text-gray-600">
                Nice work {user?.username}! Waiting for {friend?.username} to
                answer...
              </Text>
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
