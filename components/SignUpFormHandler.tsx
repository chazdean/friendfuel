import React, { useState } from "react";
import { TextInput, Button, Text, View, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "@/context/authContext";
import Checkbox from "expo-checkbox";

export interface SignupFormInputs {
  name: string;
  email: string;
  username: string;
  password: string;
  profileUrl?: string;
}

export default function SignupFormHandler() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>();

  const [loading, setLoading] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any>("");
  const { register } = useAuth();

  const onSubmit = async (data: SignupFormInputs) => {
    setLoading(true);
    setErrorMessage("");
    try {
      await register(data);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex flex-col w-full gap-y-4 mb-4">
      {/* Name Field */}
      <Controller
        control={control}
        name="name"
        rules={{ required: "Name is required" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={`border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-full h-[50px] p-3`}
            placeholder="Name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.name && (
        <Text className="text-red-500 mb-2">{errors.name.message}</Text>
      )}

      {/* Email Field */}
      <Controller
        control={control}
        name="email"
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: "Invalid email address",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={`border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-full h-[50px] p-3`}
            placeholder="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
          />
        )}
      />
      {errors.email && (
        <Text className="text-red-500 mb-2">{errors.email.message}</Text>
      )}

      {/* Username Field */}
      <Controller
        control={control}
        name="username"
        rules={{ required: "Username is required" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={`border ${
              errors.username ? "border-red-500" : "border-gray-300"
            } rounded-full h-[50px] p-3`}
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.username && (
        <Text className="text-red-500 mb-2">{errors.username.message}</Text>
      )}

      {/* Password Field */}
      <Controller
        control={control}
        name="password"
        rules={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters long",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={`border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-full h-[50px] p-3`}
            placeholder="Password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
          />
        )}
      />
      {errors.password && (
        <Text className="text-red-500 mb-2">{errors.password.message}</Text>
      )}

      <View className="flex flex-row items-center justify-center gap-x-2">
        <Checkbox value={isChecked} onValueChange={setChecked} />
        <Text className="text-sm text-left text-wrap">
          By continuing you accept our{" "}
          <Text className="text-blue-500">Privacy Policy</Text> and {"\n"}
          <Text className="text-blue-500 text-wrap">Terms of Use</Text>
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        className="flex-row items-center justify-center px-32 py-4 h-[50px] bg-black rounded-full"
        onPress={handleSubmit(onSubmit)}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.5,
          shadowRadius: 9,
        }}
      >
        <Text className="text-white text-lg font-bold">Sign Up</Text>
      </TouchableOpacity>

      {loading && (
        <Text className="text-center mt-4">Creating your account...</Text>
      )}
      {errorMessage && (
        <Text className="text-red-500 text-center mt-4">{errorMessage}</Text>
      )}
    </View>
  );
}
