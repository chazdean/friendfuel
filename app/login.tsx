import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import LoginFormHandler from "@/components/LoginFormHandler";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
export default function LoginScreen() {
  const router = useRouter();
  const { loginWithGoogle, loginWithApple } = useAuth();

  return (
    <View className="flex-1 bg-white items-center pt-28 px-6">
      <View className="w-full">
        <View className="flex flex-col items-center gap-y-2 pb-10">
          <Text>Hey there,</Text>
          <Text className="text-2xl font-semibold">Welcome Back</Text>
        </View>

        <LoginFormHandler />
      </View>

      <View className="mt-auto w-full items-center gap-y-5 pb-16">
        <Text>Or</Text>
        <TouchableOpacity
          className="flex-row items-center justify-center gap-x-2 w-full py-4 h-[50px] rounded-full border border-gray-300"
          onPress={() => loginWithGoogle()}
        >
          <Image
            source={require("../assets/images/google-logo.png")}
            resizeMode="contain"
            style={{ width: 24, height: 24, marginLeft: 8 }}
          />
          <Text className="text-black text-md font-bold">
            Sign in with Google
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center justify-center gap-x-2 w-full py-4 h-[50px] rounded-full border border-gray-300"
          onPress={() => loginWithApple()}
        >
          <Image
            source={require("../assets/images/apple-logo.png")}
            resizeMode="contain"
            style={{ width: 24, height: 24 }}
          />
          <Text className="text-black text-md font-bold">
            Sign in with Apple
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text className="text-xs text-center px-10">
            Don't have an account? <Text className="font-bold">Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
