import { useState } from "react";
import { createChatInFirestore } from "@/firebaseServices/chats";

const useCreateChat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createChat = async (
    questionId: string,
    participantIds: string[],
    onSuccess: (chatId: string) => void,
    onError: (error: any) => void
  ) => {
    setLoading(true);
    setError(null);

    try {
      const chatId = await createChatInFirestore(questionId, participantIds);
      onSuccess(chatId); // Pass the created chat ID to the success callback
    } catch (err: any) {
      setError(err.message);
      onError(err);
    } finally {
      setLoading(false);
    }
  };

  return { createChat, loading, error };
};

export default useCreateChat;
