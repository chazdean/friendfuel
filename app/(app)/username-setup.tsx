import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";

export default function UsernameSetupScreen() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { user, updateUsername } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setError("");
      await updateUsername(username);
      router.replace("/(app)");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View className="flex-1 bg-white items-center pt-28 pb-16 px-6">
      <View className="flex flex-col items-center gap-y-2 pt-5">
        <Text className="text-2xl font-semibold">Choose your username</Text>
        <Text className="text-gray-500">
          This will be your unique identifier
        </Text>
      </View>

      <View className="w-full mt-8">
        <TextInput
          className="w-full border border-gray-300 rounded-lg p-3 mb-2"
          placeholder="Enter username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        {error && <Text className="text-red-500 text-sm">{error}</Text>}

        <TouchableOpacity
          className="bg-black px-32 py-4 rounded-full shadow-md mt-4"
          onPress={handleSubmit}
          disabled={!username.trim()}
        >
          <Text className="text-white text-center font-semibold">Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
