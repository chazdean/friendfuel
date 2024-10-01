import { useQuery } from "@tanstack/react-query";
import { fetchPersonalStreakFromFirestore } from "@/firebaseServices/streak";
import { useAuth } from "@/context/authContext";

interface StreakData {
  currentStreak: number;
  lastStreakDate: Date;
  streakHistory: {
    [date: string]: { completed: boolean };
  };
}

export function usePersonalStreak() {
  const { user } = useAuth();

  const {
    data: streak,
    isLoading,
    error,
    refetch,
  } = useQuery<StreakData | null, Error>({
    queryKey: ["personalStreak", user?.uid],
    queryFn: () => fetchPersonalStreakFromFirestore(user!.uid),
    enabled: !!user,
  });

  return {
    streak: streak || null,
    loading: isLoading,
    error,
    refetch,
  };
}
