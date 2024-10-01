import { useAuth } from "@/context/authContext";
import useCreateChat from "@/hooks/useCreateChat";
import useFriends from "@/hooks/useFriends";
import { Friend, Question } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, Pressable, Image, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FriendSelect() {
  const { user } = useAuth();
  const { question } = useLocalSearchParams<{ question: string }>(); // Retrieve the question ID
  const { friends, isLoading: loadingFriends, error } = useFriends();
  const { createChat } = useCreateChat();
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const router = useRouter();

  const parsedQuestion = JSON.parse(question) as Question;

  // Loading state
  if (loadingFriends) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-white">
        <View className="flex flex-col h-full bg-white px-6">
          <Text>Loading friend requests...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-white">
        <View className="flex flex-col h-full bg-white px-6">
          <Text>Error loading friend requests: {error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // No friends state
  if (friends.length === 0) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-white">
        <View className="flex flex-col h-full bg-white px-6">
          <Text>You have no friends</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleFriendPress = (friend: Friend) => {
    // Toggle selection: Deselect if the same friend is clicked, select otherwise.
    if (selectedFriend?.id === friend.id) {
      setSelectedFriend(null);
    } else {
      setSelectedFriend(friend);
    }
  };

  const participantIds = [user?.uid as string, selectedFriend?.id as string];

  const handleConfirm = async () => {
    if (selectedFriend) {
      // Create a new chat with the selected friend
      try {
        await createChat(
          parsedQuestion.id,
          participantIds,
          (chatId) => {
            router.push({
              pathname: "/(app)/chat/[id]",
              params: {
                id: chatId,
                question,
                friend: JSON.stringify(selectedFriend),
              },
            });
          },
          (error) => {}
        );
        // Optionally, you can have further code here if needed after the chat is created successfully.
      } catch (error) {
        console.error("Error creating chat:", error);
        // Handle the error appropriately, such as displaying a user notification.
      }
    }
  };

  const renderFriend = ({ item: friend }: { item: Friend }) => (
    <Pressable
      key={friend.id}
      className="flex flex-row w-full gap-x-4 px-4 py-4 bg-white rounded-lg items-center"
      onPress={() => handleFriendPress(friend)}
    >
      <Image source={{ uri: friend.image }} className="w-12 h-12 rounded-md" />
      <View className="flex-1 flex-row items-center justify-between h-full">
        <View className="flex-1 flex-column">
          <Text className="text-black text-md font-bold">{friend.name}</Text>
          <Text className="text-gray-400 text-sm">@{friend.username}</Text>
        </View>
        <Ionicons
          name={
            selectedFriend?.id === friend.id ? "ellipse" : "ellipse-outline"
          }
          size={20}
        />
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1"
      style={{ backgroundColor: "white" }}
    >
      <View className="flex flex-col h-full bg-white">
        {/* Header Section */}
        <View className="px-6 pb-6">
          <Pressable
            onPress={() => router.back()}
            className="w-8 h-8 rounded-full bg-white items-center justify-center mb-6"
          >
            <Ionicons name="close-outline" size={24} color="black" />
          </Pressable>
          <Text className="text-2xl text-black font-bold">
            Who is your lucky friend?
          </Text>
          <Text className="text-sm text-black">
            Select a friend from the list below
          </Text>
        </View>

        {/* Main Content Section */}
        <FlatList
          className="flex bg-white px-6"
          data={friends}
          renderItem={renderFriend}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => (
            <View className="h-[1px] bg-gray-200 my-2" />
          )}
        />

        {/* Footer Section */}
        <View className="flex pb-10 bg-white px-6 py-4 border-t border-gray-200">
          <Pressable
            className={`items-center justify-center px-32 py-4 rounded-full shadow-md ${
              selectedFriend ? "bg-black" : "bg-gray-300"
            }`}
            onPress={() => handleConfirm()}
            disabled={!selectedFriend}
          >
            <Text className="text-white">Confirm</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
