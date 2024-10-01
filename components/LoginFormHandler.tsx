import React, { useState } from "react";
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "@/context/authContext";

export interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginFormHandler() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any>("");
  const { login } = useAuth();

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    setErrorMessage("");
    try {
      await login(data);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex flex-col w-full gap-y-4 mb-4">
      {/* Email Field */}
      <View>
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
              } rounded-full p-3 mb-4 h-[50px]`}
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
              } rounded-full p-3 mb-4 h-[50px]`}
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

        <Text className="text-sm font-medium text-right">Forgot Password?</Text>
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
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-lg font-bold">Log In</Text>
        )}
      </TouchableOpacity>

      {errorMessage && (
        <Text className="text-red-500 text-center mt-4">{errorMessage}</Text>
      )}
    </View>
  );
}
