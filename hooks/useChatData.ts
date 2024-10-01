import { useQuery } from "@tanstack/react-query";
import { fetchChatById } from "@/firebaseServices/chats";
import { ChatData } from "@/types/types";

export function useChatData(chatId: string) {
  const {
    data: chatData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => fetchChatById(chatId),
    // staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
    // cacheTime: 1000 * 60 * 30, // Cache persists for 30 minutes
  });

  return { chatData: chatData as ChatData, isLoading, error };
}
