import { useState } from "react";
import {
  acceptFriendRequestInFirestore,
  declineFriendRequestInFirestore,
} from "@/firebaseServices/friendRequest";

export default function useFriendRequestActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptFriendRequest = async (requestId: string) => {
    setLoading(true);
    setError(null);

    try {
      await acceptFriendRequestInFirestore(requestId);
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const declineFriendRequest = async (requestId: string) => {
    setLoading(true);
    setError(null);

    try {
      await declineFriendRequestInFirestore(requestId);
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    acceptFriendRequest,
    declineFriendRequest,
    loading,
    error,
  };
}
