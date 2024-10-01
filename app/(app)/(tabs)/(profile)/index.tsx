import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import {
  FIRESTORE_DB as db,
  FIREBASE_STORAGE as storage,
} from "@/firebaseConfig";
import { Alert } from "react-native";
import { updateDoc, doc, deleteDoc } from "firebase/firestore";

export default function ProfilePage() {
  const router = useRouter();
  const { logout, user, updateUserProfileImage } = useAuth();

  const pickImage = async () => {
    try {
      // Request permission first
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Required",
          "You need to grant access to your photos to upload an image."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.1,
        exif: false,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        console.log("result.assets[0].uri", result.assets[0].uri);
        uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      // Check if the image is the same as current profile image
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log("Blob created, size:", blob.size);

      // If the URI is the same as current profile URL, don't upload
      if (uri === user?.profileUrl) {
        console.log("Image already set as profile picture");
        Alert.alert("Info", "This image is already your profile picture");
        return;
      }

      const fileName = `profile-pictures/${user?.uid}_${Date.now()}.jpg`;
      const storageRef = ref(storage, fileName);

      console.log("Starting upload...");
      const uploadTask = uploadBytesResumable(storageRef, blob, {
        contentType: "image/jpeg",
      });

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Upload failed:", error);
            Alert.alert(
              "Upload Error",
              `Failed to upload image. Please try again.\nError: ${error.message}`
            );
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("File available at:", downloadURL);

              // Delete old profile picture if it exists and isn't the default
              if (user?.profileUrl && !user.profileUrl.includes("luffy")) {
                try {
                  const oldImageRef = ref(storage, user.profileUrl);
                  await deleteObject(oldImageRef);
                  console.log("Old profile picture deleted");
                } catch (deleteError) {
                  console.log("Failed to delete old image:", deleteError);
                  // Continue with upload even if delete fails
                }
              }

              if (user?.uid) {
                await updateDoc(doc(db, "users", user.uid), {
                  profileUrl: downloadURL,
                });

                // Update local state immediately
                updateUserProfileImage(downloadURL);

                console.log("Profile updated with new image");
              }

              Alert.alert("Success", "Profile picture updated!");
              resolve(downloadURL);
            } catch (error: any) {
              console.error("Error in completion handler:", error);
              Alert.alert(
                "Update Error",
                "Failed to update profile with new image."
              );
              reject(error);
            }
          }
        );
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      Alert.alert(
        "Upload Error",
        `Failed to upload image. Please try again.\nError: ${error.message}`
      );
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (user?.uid) {
                // Delete user's profile picture if it exists and isn't the default
                if (user.profileUrl && !user.profileUrl.includes("luffy")) {
                  const imageRef = ref(storage, user.profileUrl);
                  await deleteObject(imageRef);
                }

                // Delete user document from Firestore
                await deleteDoc(doc(db, "users", user.uid));

                // Log out the user
                await logout();

                Alert.alert("Success", "Your account has been deleted.");
              }
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert(
                "Error",
                "Failed to delete account. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white" }} className="flex-1">
      <View className="flex flex-column gap-y-6 p-6 pt-4 bg-white h-full">
        <Text className="text-3xl font-bold">Profile</Text>
        <View className="flex flex-row items-center justify-between border-y border-gray-300 py-4">
          <View className="flex flex-row items-center">
            <Pressable onPress={pickImage}>
              <Image
                source={{ uri: user?.profileUrl as string }}
                className="w-24 h-24 rounded-full"
                style={{ width: 50, height: 50 }}
              />
              <View
                style={{
                  position: "absolute",
                  bottom: -3,
                  left: 34,
                  backgroundColor: "white",
                  borderRadius: 10,
                }}
              >
                <Ionicons name="add-circle-outline" size={20} color="black" />
              </View>
            </Pressable>

            <View className="flex flex-column ml-4">
              <Text className="text-lg font-bold">{user?.name}</Text>
              <Text className="text-gray-500">@{user?.username}</Text>
            </View>
          </View>
          <Pressable onPress={() => handleLogout()}>
            <Ionicons name="exit-outline" size={24} color="black" />
          </Pressable>
        </View>

        {/* Settings List */}
        <View className="flex flex-column gap-y-4">
          <Pressable
            className="flex-row items-center p-4 bg-gray-200 rounded-lg"
            onPress={() => router.push("/(app)/account-settings")}
          >
            <View className="flex-1 flex-row items-center justify-between">
              <View className="flex flex-row items-center gap-x-2">
                <Ionicons name="cog-outline" size={24} color="black" />
                <Text className="text-base">Account Settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="black" />
            </View>
          </Pressable>

          <Pressable
            className="flex-row items-center p-4 bg-gray-200 rounded-lg"
            onPress={() => router.push("/(app)/support")}
          >
            <View className="flex-1 flex-row items-center justify-between">
              <View className="flex flex-row items-center gap-x-2">
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color="black"
                />
                <Text className="text-base">Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="black" />
            </View>
          </Pressable>

          <Pressable
            className="flex-row items-center p-4 bg-gray-200 rounded-lg"
            onPress={() => router.push("/(app)/privacy-policy")}
          >
            <View className="flex-1 flex-row items-center justify-between">
              <View className="flex flex-row items-center gap-x-2">
                <Ionicons
                  name="document-text-outline"
                  size={24}
                  color="black"
                />
                <Text className="text-base">Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="black" />
            </View>
          </Pressable>

          <Pressable
            className="flex-row items-center p-4 bg-red-100 rounded-lg"
            onPress={handleDeleteAccount}
          >
            <View className="flex-1 flex-row items-center justify-between">
              <View className="flex flex-row items-center gap-x-2">
                <Ionicons name="trash-outline" size={24} color="red" />
                <Text className="text-base text-red-600">Delete Account</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="red" />
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
