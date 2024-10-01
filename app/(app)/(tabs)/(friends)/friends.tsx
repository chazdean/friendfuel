import FriendList from "@/components/FriendList";
import React from "react";
import { View } from "react-native";

export default function Friends() {
  return (
    <View className="flex-1 bg-white px-4">
      <FriendList />
    </View>
  );
}
