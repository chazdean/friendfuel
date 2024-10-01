import { useQuery } from "@tanstack/react-query";
import { fetchQuestionsFromFirestore } from "@/firebaseServices/questions";
import { Question } from "@/types/types";

const useQuestions = () => {
  const {
    data: questions = [],
    isLoading,
    error,
  } = useQuery<Question[], Error>({
    queryKey: ["questions"],
    queryFn: fetchQuestionsFromFirestore,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return { questions, loading: isLoading, error: error?.message ?? null };
};

export default useQuestions;
