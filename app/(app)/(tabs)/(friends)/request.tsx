import useFriendRequestActions from "@/hooks/useFriendRequestActions";
import useFriendRequests from "@/hooks/useFriendRequests";
import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Request() {
  const { friendRequests, isLoading, error } = useFriendRequests();
  const { acceptFriendRequest } = useFriendRequestActions();

  if (isLoading) {
    return <Text>Loading friend requests...</Text>;
  }

  if (error) {
    return <Text>Error loading friend requests: {error.message}</Text>;
  }

  const pendingFriendRequests = friendRequests.filter(
    (friendRequest) => friendRequest.status === "pending"
  );

  if (pendingFriendRequests.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6 gap-y-2">
        <Text className="text-gray-600 text-lg text-sm">
          You have no pending friend requests
        </Text>
        <Ionicons name="people-outline" size={30} color="#9ca3af" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center bg-white px-6">
      {pendingFriendRequests.map((friendRequest) => (
        <View
          key={friendRequest.id}
          className="flex flex-row w-full gap-x-4 p-4 bg-white rounded-lg mb-4 items-center h-[100px] pt-0"
        >
          <Image
            source={{ uri: friendRequest.from.image }}
            className="w-12 h-12 rounded-md mr-4 p-2"
          />
          <View className="flex-1 flex-row items-center justify-between border-b border-gray-300 h-full">
            <View className="flex-1 flex-column">
              <Text className="text-black text-md font-bold">
                {friendRequest.from.name}
              </Text>
              <Text className="text-gray-400 text-sm">
                @{friendRequest.from.username}
              </Text>
            </View>
            <Pressable
              className="bg-black rounded-full p-2 px-4"
              onPress={() => {
                acceptFriendRequest(friendRequest.id);
              }}
            >
              <Text className="text-white text-sm font-medium">Accept</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}
