import { useState, useEffect } from "react";
import { fetchExistingChat } from "@/firebaseServices/chats";

const useExistingChat = (questionId: string, participantIds: string[]) => {
  const [chatId, setChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const existingChatId = await fetchExistingChat(
          questionId,
          participantIds
        );

        if (existingChatId) {
          setChatId(existingChatId);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (questionId && participantIds.length > 0) {
      fetchChat();
    }
  }, [questionId, participantIds]);

  return { chatId, loading, error };
};

export default useExistingChat;
