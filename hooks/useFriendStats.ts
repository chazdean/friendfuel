import { useState, useEffect } from "react";
import {
  fetchFriendStatsFromFirestore,
  FriendStats,
} from "@/firebaseServices/friendStats";
import { useAuth } from "@/context/authContext";

export default function useFriendStats(friendId: string) {
  const [friendStats, setFriendStats] = useState<FriendStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !friendId) return;

    const fetchStats = async () => {
      try {
        const stats = await fetchFriendStatsFromFirestore(user.uid, friendId);
        setFriendStats(stats);
      } catch (err: any) {
        setError(err.message || "Failed to fetch friend stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, friendId]);

  return { friendStats, loading, error };
}
