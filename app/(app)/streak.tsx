import React, { useState, useMemo } from "react";
import { Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import type { MarkedDates } from "react-native-calendars/src/types";
import { usePersonalStreak } from "@/hooks/usePersonalStreak";

export default function Streak() {
  const router = useRouter();
  const { streak: streakData, loading: isLoading } = usePersonalStreak();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const markedDates = useMemo(() => {
    const dates: MarkedDates = {};

    if (streakData?.streakHistory) {
      Object.entries(streakData.streakHistory).forEach(
        ([date, { completed }]) => {
          if (completed) {
            dates[date] = {
              selected: true,
              selectedColor: "#000000",
            };
          }
        }
      );
    }

    return dates;
  }, [streakData?.streakHistory]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#E5E7EB" }}>
      <View className="flex flex-col bg-gray-200 px-6">
        <Pressable
          onPress={() => router.push("/(app)/(tabs)")}
          className="w-8 h-8 rounded-full bg-white items-center justify-center mb-6"
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </Pressable>
        <View className="flex flex-row justify-between pb-4">
          <View className="flex flex-col">
            <Text className="text-2xl text-black font-bold">Streak</Text>
            <Text className="text-sm text-black">
              Well done on your streak!
            </Text>
          </View>
          <View className="flex flex-row items-center justify-center">
            <Ionicons name="flame-outline" size={35} color="black" />
            <View className="flex flex-col items-center justify-center">
              <Text className="text-xl text-black font-bold">
                {isLoading ? "..." : streakData?.currentStreak || 0}
              </Text>
              <Text className="text-sm text-black">
                {streakData?.currentStreak === 1 ? "day" : "days"}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View className="flex flex-col h-full bg-white px-6 pt-6">
        <Calendar
          style={{
            borderWidth: 1,
            borderColor: "#E5E7EB",
            borderRadius: 10,
          }}
          theme={{
            todayTextColor: "#2196F3",
            selectedDayBackgroundColor: "#000000",
            arrowColor: "#000000",
            monthTextColor: "#000000",
            textDayFontWeight: "400",
            dayTextColor: "#000000",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "400",
          }}
          markedDates={markedDates}
          disableAllTouchEventsForDisabledDays={true}
          maxDate={
            new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
              .toISOString()
              .split("T")[0]
          }
          onMonthChange={(month: { month: number }) => {
            setCurrentMonth(month.month - 1); // month is 1-indexed, so we subtract 1
          }}
          disableArrowRight={currentMonth === new Date().getMonth()}
        />
      </View>
    </SafeAreaView>
  );
}
