import { useState } from "react";
import { deleteFriend } from "@/firebaseServices/friends";

export default function useDeleteFriend() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteFriendAction = async (userId: string, friendId: string) => {
    setLoading(true);
    setError(null);

    try {
      await deleteFriend(userId, friendId);
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteFriendAction,
    loading,
    error,
  };
}
