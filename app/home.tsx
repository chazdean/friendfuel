import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white items-center justify-between pb-12">
      {/* Figma-exported image */}
      <View className="w-full h-3/5">
        <Image
          source={require("../assets/images/avatar-group.png")} // or use {uri: 'link-to-image'}
          style={{ width: "100%", height: "100%" }} // Adjust height/width as needed
          resizeMode="cover"
        />
      </View>

      {/* Text Content */}
      <View className="items-center px-8">
        <Text className="text-3xl text-left font-semibold mb-4">
          Connect with your friends every day
        </Text>
        <Text className="text-base text-left text-gray-600">
          Strengthen your bonds and discover new depths through meaningful
          interactions and shared experiences.
        </Text>
      </View>

      {/* Buttons */}
      <View className="flex w-full px-8 space-y-5 pt-6">
        <TouchableOpacity
          className="flex-row items-center justify-center px-32 py-4 h-[50px] bg-black rounded-full"
          onPress={() => router.push("/login")}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 9,
          }}
        >
          <Text className="text-white text-lg font-bold">Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mb-4 mt-6"
          onPress={() => router.push("/register")}
        >
          <Text className="text-black text-lg font-medium text-center">
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>

      {/* Terms and Conditions */}
      <Text className="text-xs text-center text-gray-600 px-10">
        By creating an account or signing in, you agree to our{" "}
        <Text className="font-bold underline">Terms & Conditions</Text> &{" "}
        <Text className="font-bold underline">Privacy Policy</Text>.
      </Text>
    </View>
  );
}
