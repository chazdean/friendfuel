import React, { useMemo } from "react";
import { View, Text, FlatList } from "react-native";
import InboxItem from "@/components/InboxItem";
import { useChats } from "@/hooks/useChats";
import { useAuth } from "@/context/authContext";
import { ChatData, Participant } from "@/types/types";

export default function InboxYourTurn() {
  const { user } = useAuth();
  const userId = user?.uid || ""; // Default to an empty string if `user` or `uid` is `undefined`.
  const { chats, loading, error } = useChats(userId);

  // Memoized logic to determine "yourTurn" and filter chats where it's the user's turn
  const yourTurnChats = useMemo(() => {
    return (
      chats
        ?.map((chat: ChatData) => {
          const responses = chat.responses || {}; // Default to an empty object if `responses` is `undefined`.

          // Ensure `participants` is an array; otherwise, default to an empty array.
          const participants: Participant[] = Array.isArray(chat.participants)
            ? chat.participants
            : [];

          // Find the ID of the other participant in the chat safely.
          const otherParticipant = participants.find(
            (participant: Participant) => participant.id !== userId
          );

          const otherParticipantId = otherParticipant?.id || ""; // Default to an empty string if `otherParticipant` is `undefined`.

          // Define "yourTurn" and "waiting" statuses with explicit false returns
          const yourTurn =
            !chat.completed &&
            otherParticipantId &&
            responses[otherParticipantId] &&
            !responses[userId]
              ? true
              : false;

          const waiting =
            !chat.completed &&
            otherParticipantId &&
            responses[userId] &&
            !responses[otherParticipantId]
              ? true
              : false;

          return {
            ...chat,
            yourTurn,
            waiting,
          };
        })
        .filter((chat) => chat.yourTurn) ?? [] // Fallback to an empty array if `chats` is `undefined`.
    );
  }, [chats, userId]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Loading chats...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>{error.message}</Text>
      </View>
    );
  }

  if (yourTurnChats.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>No chats where it's your turn</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={yourTurnChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <InboxItem
            id={item.id}
            title={item.question?.text}
            date={item.createdAt}
            image={item.question?.thumbnail}
            completed={item.completed}
            yourTurn={item.yourTurn}
            waiting={item.waiting}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}
