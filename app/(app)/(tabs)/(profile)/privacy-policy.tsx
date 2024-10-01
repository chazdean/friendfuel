import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      <View className="flex p-6">
        <View className="flex-row items-center gap-x-4 mb-6">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          <Text className="text-3xl font-bold">Privacy Policy</Text>
        </View>

        <ScrollView className="flex">
          <View className="flex flex-col gap-y-6">
            <View>
              <Text className="text-xl font-semibold mb-2">
                Information We Collect
              </Text>
              <Text className="text-gray-600">
                We collect information that you provide directly to us,
                including your name, email address, and any other information
                you choose to provide.
              </Text>
            </View>

            <View>
              <Text className="text-xl font-semibold mb-2">
                How We Use Your Information
              </Text>
              <Text className="text-gray-600">
                We use the information we collect to provide, maintain, and
                improve our services, communicate with you, and protect our
                services and users.
              </Text>
            </View>

            <View>
              <Text className="text-xl font-semibold mb-2">
                Information Sharing
              </Text>
              <Text className="text-gray-600">
                We do not share your personal information with third parties
                except as described in this privacy policy or with your consent.
              </Text>
            </View>

            <View>
              <Text className="text-xl font-semibold mb-2">Data Security</Text>
              <Text className="text-gray-600">
                We take reasonable measures to help protect your personal
                information from loss, theft, misuse, unauthorized access,
                disclosure, alteration, and destruction.
              </Text>
            </View>

            <View>
              <Text className="text-xl font-semibold mb-2">Contact Us</Text>
              <Text className="text-gray-600">
                If you have any questions about this Privacy Policy, please
                contact us at support@cfizz.com
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
