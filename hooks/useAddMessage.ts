import { useState } from "react";
import {
  addMessageToFirestore,
  MessageDataProps,
} from "@/firebaseServices/messages";

const useAddMessage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = async (messageData: MessageDataProps) => {
    setLoading(true);
    setError(null);

    try {
      const messageId = await addMessageToFirestore(messageData);
      console.log("Message created with ID:", messageId);
      return messageId;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addMessage, loading, error };
};

export default useAddMessage;
