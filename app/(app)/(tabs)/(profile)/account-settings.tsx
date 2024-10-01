import React, { useState, useEffect } from "react";
import { TextInput, Text, View, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "@/context/authContext";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";

export interface AccountSettingsInputs {
  username: string;
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export default function AccountSettings() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AccountSettingsInputs>();

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const {
    updateProfile,
    loading: updateLoading,
    error: updateError,
  } = useUpdateProfile();

  const password = watch("password");

  // Pre-fill form with user data on component mount
  useEffect(() => {
    if (user) {
      setValue("username", user.username || "");
      setValue("name", user.name || "");
      setValue("email", user.email || "");
    }
  }, [user, setValue]);

  const toggleEditMode = () => {
    setEditMode((prevMode) => !prevMode);
    setErrorMessage("");
  };

  // Add check for Google provider
  const isGoogleUser = user?.providerId === "google.com";

  const onSubmit = async (data: AccountSettingsInputs) => {
    setLoading(true);
    setErrorMessage("");

    try {
      if (!user?.uid) throw new Error("User not found");
      await updateProfile(user.uid, data, isGoogleUser);
      await refreshUser();
      Alert.alert(
        "Profile Updated",
        "Your profile has been updated successfully."
      );
      setEditMode(false);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View className="flex flex-col h-[75%] w-full px-6">
        <Text className="text-2xl font-medium pb-6">
          {editMode ? "Update Profile" : "General"}
        </Text>

        {/* Username Field */}
        <View>
          <Controller
            control={control}
            name="username"
            rules={{
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters long",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`border ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } rounded-full p-3 mb-4 h-[50px]`}
                placeholder="Username"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                editable={editMode}
              />
            )}
          />
          {errors.username && (
            <Text className="text-red-500 mb-2">{errors.username.message}</Text>
          )}
        </View>

        {/* Name Field */}
        <View>
          <Controller
            control={control}
            name="name"
            rules={{
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters long",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-full p-3 mb-4 h-[50px]`}
                placeholder="Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                editable={editMode}
              />
            )}
          />
          {errors.name && (
            <Text className="text-red-500 mb-2">{errors.name.message}</Text>
          )}
        </View>

        {/* Only show email and password fields for non-Google users */}
        {!isGoogleUser ? (
          <>
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
                    editable={editMode}
                  />
                )}
              />
              {errors.email && (
                <Text className="text-red-500 mb-2">
                  {errors.email.message}
                </Text>
              )}
            </View>

            {/* Password Section */}
            <Text className="text-2xl font-medium">
              {editMode ? "Update Password" : "Password"}
            </Text>
            {/* Password Field */}
            <Controller
              control={control}
              name="password"
              rules={{
                required: editMode,
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
                  editable={editMode}
                />
              )}
            />
            {errors.password && (
              <Text className="text-red-500 mb-2">
                {errors.password.message}
              </Text>
            )}

            {/* Password Confirmation Field */}
            {editMode && (
              <Controller
                control={control}
                name="passwordConfirmation"
                rules={{
                  required: editMode,
                  validate: (value) =>
                    value === password || "Passwords do not match",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`border ${
                      errors.passwordConfirmation
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-full p-3 mb-4 h-[50px]`}
                    placeholder="Confirm Password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                    editable={editMode}
                  />
                )}
              />
            )}
            {errors.passwordConfirmation && (
              <Text className="text-red-500 mb-2">
                {errors.passwordConfirmation.message}
              </Text>
            )}
          </>
        ) : (
          <View className="my-4 pb-4">
            <Text className="text-sm text-gray-500">
              Email and password are managed by Google
            </Text>
            <Text className="text-sm text-gray-500">{user?.email}</Text>
          </View>
        )}

        {/* Edit/Update Button */}
        <TouchableOpacity
          className="flex-row items-center justify-center px-32 py-4 h-[50px] bg-black rounded-full"
          onPress={editMode ? handleSubmit(onSubmit) : toggleEditMode}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 9,
          }}
          disabled={loading}
        >
          <Text className="text-white text-lg font-bold">
            {editMode ? "Update Profile" : "Edit Profile"}
          </Text>
        </TouchableOpacity>

        {loading && <Text className="text-center mt-4">Updating...</Text>}
        {errorMessage && (
          <Text className="text-red-500 text-center mt-4">{errorMessage}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
