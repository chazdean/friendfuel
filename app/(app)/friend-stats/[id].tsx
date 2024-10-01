import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import useFriendStats from "@/hooks/useFriendStats";
import { Ionicons } from "@expo/vector-icons";

export default function FriendStats() {
  const { id: friendId } = useLocalSearchParams<{ id: string }>();
  const { friendStats, loading, error } = useFriendStats(friendId);

  console.log("friendStats", friendStats);

  const CloseButton = () => (
    <Pressable
      onPress={() => router.back()}
      style={({ pressed }) => pressed && { opacity: 0.7 }}
      className="pl-4"
    >
      <Ionicons name="close" size={24} color="black" />
    </Pressable>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1">
        <CloseButton />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1">
        <CloseButton />
        <View className="flex items-center justify-center">
          <Text className="text-red-500">{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!friendStats) {
    return (
      <SafeAreaView className="flex-1">
        <CloseButton />
        <View className="flex items-center justify-center">
          <Text>No stats available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "white" }}>
      <CloseButton />
      <View className="flex-1 bg-white p-4">
        <View className="space-y-4">
          <View className="bg-gray-100 p-4 rounded-lg">
            <Text className="text-lg">
              Conversations Answered: {friendStats.chatsAnswered}
            </Text>
            <Text className="text-lg">
              Current Streak: {friendStats.streakWithFriend}{" "}
              {friendStats.streakWithFriend === 1 ? "day" : "days"}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
