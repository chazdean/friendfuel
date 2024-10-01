import React from "react";
import { FlatList, Text, View, Pressable } from "react-native";
import useQuestions from "@/hooks/useQuestions";
import QuestionListItem from "@/components/QuestionListItem";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Questions() {
  const { questions } = useQuestions();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#E5E7EB" }}>
      <View className="flex flex-col bg-gray-200 px-6">
        <Pressable
          onPress={() => router.push("/(app)/(tabs)")}
          className="w-8 h-8 rounded-full bg-white items-center justify-center mb-6"
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </Pressable>
        <Text className="text-2xl text-black font-bold">Questions</Text>
        <Text className="text-sm text-black mb-5">
          Ask a friend a meaningful question
        </Text>
      </View>
      <FlatList
        className="flex px-6 pb-5 pt-8 bg-white"
        data={questions}
        renderItem={({ item }) => <QuestionListItem question={item} />}
        keyExtractor={(item) => item.id}
        bounces={false}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        ItemSeparatorComponent={() => (
          <View className="h-[1px] bg-gray-200 my-2" />
        )}
      />
    </SafeAreaView>
  );
}
