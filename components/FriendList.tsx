import React from "react";
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import useFriends from "@/hooks/useFriends";
import FriendListItem from "./FriendListItem";
import { Ionicons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import useDeleteFriend from "@/hooks/useDeleteFriend";
import { useAuth } from "@/context/authContext";

export default function FriendList() {
  const { user } = useAuth();
  const { friends, isLoading, error } = useFriends();
  const { deleteFriendAction, loading, error: deleteError } = useDeleteFriend();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="small" color="#666666" />
      </View>
    );
  }

  if (friends.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6 gap-y-2">
        <Text className="text-gray-600 text-lg text-sm">
          You have no friends
        </Text>
        <Ionicons name="people-outline" size={30} color="#9ca3af" />
      </View>
    );
  }
  const handleDeleteFriend = async (friendId: string) => {
    if (!user) return;

    Alert.alert(
      "Delete Friend",
      "Are you sure you want to delete this friend? All chats and data associated with this friend will be permanently deleted.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            await deleteFriendAction(user.uid, friendId);
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const renderRightActions = (friendId: string) => {
    return (
      <Pressable
        onPress={() => handleDeleteFriend(friendId)}
        className="w-20 bg-red-500 justify-center items-center"
      >
        <Ionicons name="trash-outline" size={24} color="white" />
      </Pressable>
    );
  };

  return (
    <FlatList
      data={friends}
      keyExtractor={(friend) => friend.id}
      renderItem={({ item: friend }) => (
        <Swipeable
          renderRightActions={() => renderRightActions(friend.id)}
          overshootRight={false}
          containerStyle={{ height: 72 }} // Add fixed height here
        >
          <FriendListItem
            id={friend.id}
            name={friend.name}
            username={friend.username}
            image={friend.image}
          />
        </Swipeable>
      )}
      ListEmptyComponent={
        <Text>
          {error
            ? `Error loading friend requests: ${error}`
            : "You have no friends"}
        </Text>
      }
      ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-200" />}
    />
  );
}
