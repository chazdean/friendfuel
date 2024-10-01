import { useAuth } from "@/context/authContext";
import { sendFriendRequestInFirestore } from "@/firebaseServices/friendRequest";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";

interface FormData {
  username: string;
}

export default function AddFriend() {
  const { user } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const fromUserId = user?.uid as string; // Replace this with the actual user ID from auth context
      await sendFriendRequestInFirestore(data.username, fromUserId);

      // Success handling
      setSuccess("Friend request sent successfully!");
    } catch (err: any) {
      // Error handling
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center bg-white px-6">
      <View className="flex flex-col items-start w-full pt-6 gap-y-2">
        <Text className="text-2xl text-black font-bold ">Add Friend</Text>
        <Text className="text-md pb-4">
          Enter friend username to send a friend request.
        </Text>
      </View>

      {/* Error message display */}
      {error && <Text className="text-red-500 mb-2">{error}</Text>}

      {/* Success message display */}
      {success && <Text className="text-green-500 mb-2">{success}</Text>}

      {/* Controller to manage username input */}
      <Controller
        control={control}
        name="username"
        rules={{ required: "Username is required" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="w-full pb-6">
            <TextInput
              className="w-full p-4 border border-gray-300 rounded-full h-[50px]"
              placeholder="Enter username"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {/* Display input validation error */}
            {errors.username && (
              <Text className="text-red-500">{errors.username.message}</Text>
            )}
          </View>
        )}
      />

      {/* Loading spinner */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Pressable
            className="flex-row items-center justify-center px-32 py-4 h-[50px] bg-black rounded-full"
            onPress={handleSubmit(onSubmit)}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0.5, height: 3 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
            }}
          >
            <Text className="text-white text-lg font-bold">Send</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
