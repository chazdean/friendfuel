import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Navbar() {
  const router = useRouter();

  return (
    <View className="flex h-[100px] bg-gray-100 flex-row pb-4 items-end justify-between px-4">
      {/* Navbar Start */}
      <TouchableOpacity onPress={() => console.log("Left Icon Pressed")}>
        <Text className="text-2xl">🤝</Text>
      </TouchableOpacity>

      {/* Navbar Center */}
      <View>
        <Text className="text-xl font-bold">FriendFuel</Text>
      </View>

      {/* Navbar End */}
      <TouchableOpacity>
        <Ionicons name="settings-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}
