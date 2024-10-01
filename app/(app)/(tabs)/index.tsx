import React from "react";
import { ScrollView, View, Text, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { usePersonalStreak } from "@/hooks/usePersonalStreak";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const router = useRouter();
  const { streak } = usePersonalStreak();

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      <ScrollView className="flex">
        <View className="flex-1 flex-col gap-y-4 items-center pt-4 px-6">
          {/* <Pressable
            className="w-full bg-red-500 p-4 rounded-xl"
            onPress={addQuestionsToFirebase}
          >
            <Text className="text-white text-center font-bold">
              Add Questions to database (Admin Only)
            </Text>
          </Pressable> */}
          {/* Header Card */}
          <View className="flex flex-row w-full justify-between items-center pr-2">
            <Text className="text-3xl font-bold">Home</Text>
            <Pressable
              className="flex flex-row items-center"
              onPress={() => router.push("/(app)/streak")}
            >
              <Ionicons name="flame-outline" size={24} color="black" />
              <Text className="text-sm font-bold">
                {streak?.currentStreak || 0}
              </Text>
            </Pressable>
          </View>
          <Pressable className="w-full bg-black h-[220px] p-10 rounded-2xl">
            <View className="flex flex-row items-center">
              <View className="flex-1 flex-col gap-y-4 basis-1/2">
                <Text className="text-3xl font-bold text-white">
                  Connect with your friends everyday
                </Text>
                <View className="flex flex-row items-center bg-white rounded-2xl self-start p-2 px-4">
                  <Text className="text-sm">Get Started.</Text>
                </View>
              </View>
              <View className="flex flex-1 basis-1/3 items-center justify-center">
                <Image
                  source={require("../../../assets/images/chat-bubble.png")}
                  style={{ width: "70%", height: "70%" }}
                  resizeMode="contain"
                />
              </View>
            </View>
          </Pressable>
          {/* Questions Card */}
          <Pressable
            className="justify-center w-full bg-black h-[150px] p-10 rounded-2xl"
            onPress={() => router.push("/(app)/question-help")}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 4, height: 6 },
              shadowOpacity: 0.5,
              shadowRadius: 4,
            }}
          >
            <View className="flex flex-row">
              <View className="flex flex-col basis-4/5">
                <Text className="text-2xl font-bold text-white">Question</Text>
                <Text className="text-sm text-white mt-2">
                  Answer meaningful questions with your friends
                </Text>
              </View>
              <View className="flex-1 items-center justify-center basis-1/5">
                <Image
                  source={require("../../../assets/images/question-select.png")}
                  style={{ width: "70%", height: "70%" }}
                  resizeMode="contain"
                />
              </View>
            </View>
          </Pressable>
          {/* Games Card */}
          <Pressable
            className="w-full justify-center bg-gray-400/50 h-[150px] p-10 rounded-2xl opacity-50"
            onPress={() => {}}
          >
            <View>
              <View className="flex flex-row items-center gap-x-2 justify-between">
                <Text className="text-2xl font-bold text-gray-700">Game</Text>
                <Text className="text-xs font-bold text-gray-700">
                  (coming soon)
                </Text>
              </View>
              <Text className="text-sm text-gray-600 mt-2">
                Learn more about your friends in a fun way
              </Text>
            </View>
          </Pressable>
          {/* Quizzes Card */}
          <Pressable
            className="w-full justify-center bg-gray-400/50 h-[150px] p-10 rounded-2xl opacity-50"
            onPress={() => {}}
          >
            <View>
              <View className="flex flex-row items-center gap-x-2 justify-between">
                <Text className="text-2xl font-bold text-gray-700">Quiz</Text>
                <Text className="text-xs font-bold text-gray-700">
                  (coming soon)
                </Text>
              </View>
              <Text className="text-sm text-gray-600 mt-2">
                Identify relationship strengths and areas for growth
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
