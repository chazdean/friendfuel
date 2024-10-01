import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Support() {
  const router = useRouter();
  const supportEmail = "support@cfizz.com";
  const [showSafetyBanner, setShowSafetyBanner] = useState(true);

  useEffect(() => {
    checkBannerStatus();
  }, []);

  const checkBannerStatus = async () => {
    try {
      const hasSeenBanner = await AsyncStorage.getItem("safetyBannerDismissed");
      if (hasSeenBanner === "true") {
        setShowSafetyBanner(false);
      }
    } catch (error) {
      console.error("Error checking banner status:", error);
    }
  };

  const dismissBanner = async () => {
    try {
      await AsyncStorage.setItem("safetyBannerDismissed", "true");
      setShowSafetyBanner(false);
    } catch (error) {
      console.error("Error saving banner status:", error);
    }
  };

  const handleEmailSupport = async () => {
    const url = `mailto:${supportEmail}`;
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      await Linking.openURL(url);
    } else {
      alert(
        "Unable to open email client. Please email us directly at " +
          supportEmail
      );
    }
  };

  const resetSafetyBanner = async () => {
    try {
      await AsyncStorage.removeItem("safetyBannerDismissed");
      setShowSafetyBanner(true);
    } catch (error) {
      console.error("Error resetting banner status:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "white" }}>
      <View className="flex-row gap-x-4 pb-4 px-4 pt-6 items-center">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text className="text-3xl font-bold">Support</Text>
      </View>
      <View className="flex flex-col gap-y-4 bg-white h-full pt-4 px-4">
        {showSafetyBanner && (
          <View className="bg-blue-50 rounded-lg p-4">
            <View className="flex-row justify-between items-start">
              <Text className="text-base font-semibold mb-2 flex-1">
                Safety & Reporting Features
              </Text>
              <Pressable onPress={dismissBanner} className="p-1">
                <Ionicons name="close" size={20} color="#3b82f6" />
              </Pressable>
            </View>
            <View className="gap-y-2">
              <View className="flex-row items-center gap-x-2">
                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color="#3b82f6"
                />
                <Text className="text-sm text-gray-700 flex-1">
                  Report inappropriate messages by long-pressing on a message
                  and selecting "Report Message"
                </Text>
              </View>
              <View className="flex-row items-center gap-x-2 mt-2">
                <Ionicons
                  name="person-remove-outline"
                  size={20}
                  color="#3b82f6"
                />
                <Text className="text-sm text-gray-700 flex-1">
                  Block and remove friends by swiping left on their name and
                  tapping "Delete"
                </Text>
              </View>
            </View>
          </View>
        )}

        <View className="flex flex-column gap-y-4">
          <Pressable
            className="flex-row items-center p-4 bg-gray-100 rounded-lg"
            onPress={handleEmailSupport}
          >
            <View className="flex-1 flex-row items-center justify-between">
              <View className="flex flex-row items-center gap-x-2">
                <Ionicons name="mail-outline" size={24} color="black" />
                <Text className="text-base">Email Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="black" />
            </View>
          </Pressable>

          {!showSafetyBanner && (
            <Pressable
              className="flex-row items-center p-4 bg-blue-50 rounded-lg"
              onPress={resetSafetyBanner}
            >
              <View className="flex-1 flex-row items-center justify-between">
                <View className="flex flex-row items-center gap-x-2">
                  <Ionicons name="shield-outline" size={24} color="#3b82f6" />
                  <Text className="text-base text-blue-600">
                    View Safety Information
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#3b82f6" />
              </View>
            </Pressable>
          )}

          <View className="p-4 bg-gray-100 rounded-lg">
            <Text className="text-base font-medium mb-2">Support Hours</Text>
            <Text className="text-gray-600">Monday - Friday</Text>
            <Text className="text-gray-600">9:00 AM - 5:00 PM EST</Text>
          </View>

          <View className="p-4 bg-gray-100 rounded-lg">
            <Text className="text-base font-medium mb-2">FAQ</Text>
            <Text className="text-gray-600 mb-2">
              For quick answers to common questions, please visit our FAQ
              section on our website.
            </Text>
            <Text className="text-gray-600">
              Average response time: 24-48 hours
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
