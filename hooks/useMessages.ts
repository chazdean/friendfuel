import { useQuery } from "@tanstack/react-query";
import { fetchMessagesFromFirestore } from "@/firebaseServices/messages";
import type { MessageData } from "@/types/types";

export default function useMessages(chatId: string) {
  const {
    data: messages,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => fetchMessagesFromFirestore(chatId),
    enabled: !!chatId, // Only run query if chatId exists
  });

  return {
    messages: (messages || []) as unknown as MessageData[],
    loading: isLoading,
    error,
    refetch,
  };
}
