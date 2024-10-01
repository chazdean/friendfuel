import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View, Image, Text } from "react-native";
import { useRouter } from "expo-router";

export interface FriendListItemProps {
  id: string;
  name: string;
  username: string;
  image?: string;
}

export default function FriendListItem({
  id,
  name,
  username,
  image,
}: FriendListItemProps) {
  const router = useRouter();

  return (
    <Pressable className="flex-row h-full w-full p-4 bg-white items-center">
      <Image source={{ uri: image }} className="w-12 h-12 rounded-md" />
      <View className="flex-1 flex-row items-center justify-between ml-4 py-2">
        <View>
          <Text className="text-black text-md font-bold">{name}</Text>
          <Text className="text-gray-400 text-sm">@{username}</Text>
        </View>
        <Pressable
          onPress={() => {
            router.push(`/friend-stats/${id}`);
          }}
        >
          <Ionicons name="happy-outline" size={20} />
        </Pressable>
      </View>
    </Pressable>
  );
}
