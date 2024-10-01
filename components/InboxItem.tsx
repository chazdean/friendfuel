import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { Timestamp } from "firebase/firestore";

interface InboxItemProps {
  id: string;
  title?: string;
  date?: Timestamp;
  image?: string;
  completed?: boolean;
  yourTurn?: boolean;
  waiting?: boolean;
}

export default function InboxItem({
  id: chatId,
  title,
  date,
  image,
  completed,
  yourTurn,
  waiting,
}: InboxItemProps) {
  const router = useRouter();

  return (
    <Pressable
      className="flex flex-row items-center py-5 border-b border-gray-200"
      onPress={() =>
        router.push({
          pathname: "/(app)/chat/[id]",
          params: {
            id: chatId,
          },
        })
      }
    >
      <View className="flex-row items-center gap-x-4">
        {image ? (
          <Image
            source={image}
            contentFit="cover"
            transition={1000}
            cachePolicy="memory-disk"
            style={{
              width: 60,
              height: 60,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "#D1D5DB",
            }}
          />
        ) : (
          <View className="p-2">
            <Ionicons name="image-sharp" size={30} />
          </View>
        )}
        <View style={{ flex: 1, flexDirection: "column", gap: 4 }}>
          <View className="flex items-left gap-x-2 bg-gray-200 px-2 py-1 rounded-full self-start">
            <Text className="text-xs font-medium">Question</Text>
          </View>
          <Text
            className="text-sm font-bold"
            numberOfLines={2}
            style={{ flexShrink: 1 }}
          >
            {title}
          </Text>
        </View>
        <View style={{ marginLeft: "auto" }}>
          <View className="flex-row">
            {completed && <Ionicons name="checkmark-outline" size={16} />}
            {yourTurn && <Ionicons name="alert-outline" size={16} />}
            {waiting && <Ionicons name="time-outline" size={16} />}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
