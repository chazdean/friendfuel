import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="gray" />
    </View>
  );
}
