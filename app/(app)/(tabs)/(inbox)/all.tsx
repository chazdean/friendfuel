import React, { useMemo } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import InboxItem from "@/components/InboxItem";
import { useChats } from "@/hooks/useChats";
import { useAuth } from "@/context/authContext";
import { ChatData, Participant } from "@/types/types";

export default function InboxAll() {
  const { user } = useAuth();
  const userId = user?.uid || ""; // Ensure userId is an empty string if `user` or `uid` is undefined.
  const { chats, loading, error } = useChats(userId);

  // Memoized logic to determine "yourTurn", "waiting", or "completed" statuses.
  const enrichedChats = useMemo(() => {
    return (
      chats
        ?.map((chat: ChatData) => {
          const responses = chat.responses || {}; // Default to empty object if responses is undefined
          const participants: Participant[] = chat.participants || []; // Default to empty array if participants is undefined

          const otherParticipant = participants.find(
            (participant: Participant) => participant.id !== userId
          );

          const otherParticipantId = otherParticipant?.id;

          // Check if responses exist for each participant
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
            !responses[otherParticipantId]
              ? true
              : false;

          const completed = chat.completed ? true : false;

          return {
            ...chat,
            yourTurn,
            waiting,
            completed,
          };
        })
        .sort((a, b) => {
          return (
            (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)
          );
        }) ?? []
    );
  }, [chats, userId]);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Error loading chats: {error.message || String(error)}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={loading ? [] : enrichedChats}
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
        contentContainerStyle={[
          { padding: 16 },
          (!enrichedChats.length || loading) && { flex: 1 },
        ]}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center">
            {loading ? (
              <ActivityIndicator size="small" color="#666666" />
            ) : (
              <Text>You have no active chats</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}
