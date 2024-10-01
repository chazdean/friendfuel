import { doc, updateDoc } from "firebase/firestore";
import { updateEmail, updatePassword } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebaseConfig";

interface UpdateUserData {
  username?: string;
  name?: string;
  email?: string;
  password?: string;
}

export const updateUserProfile = async (
  userId: string,
  data: UpdateUserData,
  isGoogleUser: boolean
) => {
  const userRef = doc(FIRESTORE_DB, "users", userId);
  const updates: UpdateUserData = {};

  // Update basic info in Firestore
  if (data.username) updates.username = data.username;
  if (data.name) updates.name = data.name;

  // Update Firestore document
  if (Object.keys(updates).length > 0) {
    await updateDoc(userRef, updates as { [key: string]: any });
  }

  // Only proceed with email/password updates for non-Google users
  if (!isGoogleUser) {
    if (data.email && FIREBASE_AUTH.currentUser) {
      await updateEmail(FIREBASE_AUTH.currentUser, data.email);
    }

    if (data.password && FIREBASE_AUTH.currentUser) {
      await updatePassword(FIREBASE_AUTH.currentUser, data.password);
    }
  }
};
