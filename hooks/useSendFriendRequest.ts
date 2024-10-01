import { useState } from "react";
import { sendFriendRequestInFirestore } from "@/firebaseServices/friendRequest";
import { useAuth } from "@/context/authContext";

export default function useSendFriendRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // Assuming `user` contains the current authenticated user's ID

  const sendFriendRequest = async (username: string) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    setLoading(true);
    setError(null);

    try {
      const friendRequest = await sendFriendRequestInFirestore(
        username,
        user.uid
      );
      return friendRequest;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendFriendRequest, loading, error };
}
