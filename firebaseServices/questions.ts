import { collection, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";
import { Question } from "@/types/types";

export const fetchQuestionsFromFirestore = async () => {
  try {
    const questionsCollection = collection(FIRESTORE_DB, "questions");
    const questionsSnapshot = await getDocs(questionsCollection);
    const questions = questionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Question[];

    return questions;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
