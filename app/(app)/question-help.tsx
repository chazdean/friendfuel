import React from "react";
import { Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuestionHelp() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#FFFFFF" }}>
      <View className="flex flex-col px-6 h-full">
        <View className="flex flex-row pb-6 pt-6 items-center mb-4">
          <Pressable
            onPress={() => router.push("/(app)/(tabs)")}
            className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
          >
            <Ionicons name="close-outline" size={27} color="black" />
          </Pressable>
        </View>
        <View className="flex flex-col justify-center items-center pb-6">
          <Text className="text-3xl">Asking a Question</Text>
        </View>
        <View>
          <View className="bg-gray-200 p-4 rounded-xl mb-4">
            <Text className="text-lg">🏆 Goal</Text>
            <Text className="text-sm mt-2">
              Foster meaningful connections that deepen existing relationships
              and open the door to new ones
            </Text>
          </View>
          <View className="flex flex-col gap-y-2 bg-gray-200 p-4 rounded-xl">
            <Text className="text-lg">ℹ️ How it works</Text>
            <Text className="text-sm mt-2">
              <Text className="font-bold">Select a Question:</Text> Choose from
              the curated list of meaningful questions
            </Text>
            <Text className="text-sm mt-2">
              <Text className="font-bold">Choose a Friend:</Text> Pick someone
              from your friends list to share the question with
            </Text>
            <Text className="text-sm mt-2">
              <Text className="font-bold">Answer Honestly:</Text> Share your
              response to the question and wait for your friend to answer
            </Text>
          </View>
        </View>
      </View>
      <Pressable
        // className="bg-black p-4 rounded-xl mx-6 mt-auto"
        className="bg-black items-center justify-center px-32 py-4 rounded-full shadow-md mx-6 mt-auto"
        onPress={() => router.push("/(app)/questions")}
      >
        <Text className="text-white text-center font-bold">
          Select a Question
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
