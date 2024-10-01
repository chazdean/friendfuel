import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  signInWithCredential,
  User,
} from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider } from "firebase/auth";
import * as WebBrowser from "expo-web-browser";
import { LoginFormInputs } from "@/components/LoginFormHandler";
import { SignupFormInputs } from "@/components/SignUpFormHandler";
import * as AppleAuthentication from "expo-apple-authentication";
import { OAuthProvider } from "firebase/auth";

// Ensure to complete the Google Auth session
WebBrowser.maybeCompleteAuthSession();

export interface AuthenticatedUser {
  uid: string;
  email: string;
  name: string;
  username: string;
  profileUrl: string;
  friends: string[];
  personalStreak: number;
  lastInteractionDate: Date | null;
  createdAt: Date;
  providerId: string;
}

interface AuthContextType {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean | undefined;
  login: ({ email, password }: LoginFormInputs) => Promise<void>;
  logout: () => Promise<{ success: boolean; msg?: string; error?: any }>;
  register: ({
    email,
    password,
    username,
    profileUrl,
    name,
  }: SignupFormInputs) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  updateUserProfileImage: (profileUrl: string) => void;
  loginWithApple: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(
    undefined
  );

  // Google Auth request initialization
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "247384973062-mi6cnft1hfk0oceb8gd1hljcer1vi2c3.apps.googleusercontent.com",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (!user) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      setIsAuthenticated(true);

      // Get Firestore data
      const docRef = doc(collection(FIRESTORE_DB, "users"), user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // If user exists in Firestore, use that data
        const userData = docSnap.data();
        setUser({
          ...userData,
          providerId: user.providerData?.[0]?.providerId || "",
        } as AuthenticatedUser);
      } else {
        // If user doesn't exist in Firestore, use basic Auth data
        setUser({
          uid: user.uid,
          email: user.email || "",
          name: user.displayName || "",
          username: "",
          profileUrl: user.photoURL || "",
          friends: [],
          personalStreak: 0,
          lastInteractionDate: null,
          createdAt: new Date(),
          providerId: user.providerData?.[0]?.providerId || "",
        });
      }
    });

    return unsubscribe;
  }, []);

  const login = async ({ email, password }: LoginFormInputs): Promise<void> => {
    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Failed to login. Please try again.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No user found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      }
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      return { success: true };
    } catch (error: any) {
      return { success: false, msg: error.message, error };
    }
  };

  const register = async ({
    email,
    password,
    username,
    name,
    profileUrl,
  }: SignupFormInputs): Promise<void> => {
    try {
      // Check if username is unique
      const usersCollection = collection(FIRESTORE_DB, "users");
      const q = query(usersCollection, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error(
          "Username is already taken. Please choose another one."
        );
      }

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const newUser = userCredential.user;

      if (newUser && newUser.email) {
        // Add user to Firestore
        const userDoc = doc(usersCollection, newUser.uid);
        await setDoc(userDoc, {
          uid: newUser.uid,
          email: newUser.email,
          name,
          username,
          profileUrl:
            "https://firebasestorage.googleapis.com/v0/b/friendfuel-17dd7.firebasestorage.app/o/profile%20img%2Fluffy%20profile%20picture.JPG?alt=media&token=6c662d1f-04ec-4b30-aa99-5bb00a67125d",
          friends: [],
          personalStreak: 0,
          lastInteractionDate: null,
          createdAt: new Date(),
        });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "Failed to register. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use.";
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          "The password is too weak. Please choose a stronger password.";
      }
      throw new Error(errorMessage);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      await promptAsync();
    } catch (error: any) {
      console.error("Error during Google sign-in: ", error);
    }
  };

  // Use the Google sign-in response in a useEffect hook
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      if (!id_token) {
        console.error("Google sign-in did not return a valid ID token.");
        return;
      }

      const googleCredential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(FIREBASE_AUTH, googleCredential)
        .then(async (userCredential) => {
          const newUser = userCredential.user;
          const usersCollection = collection(FIRESTORE_DB, "users");
          const userDoc = doc(usersCollection, newUser.uid);
          const userDocSnap = await getDoc(userDoc);

          if (!userDocSnap.exists()) {
            await setDoc(userDoc, {
              uid: newUser.uid,
              email: newUser.email,
              name: newUser.displayName || "",
              username: "", // Empty username for new users
              profileUrl: newUser.photoURL || "",
              friends: [],
              personalStreak: 0,
              lastInteractionDate: null,
              createdAt: new Date(),
            });
          }
        })
        .catch((error) => {
          console.error("Firebase sign-in error:", error);
        });
    }
  }, [response]);

  const refreshUser = async () => {
    if (FIREBASE_AUTH.currentUser) {
      // Get Firestore data to maintain consistency with the rest of the code
      const docRef = doc(
        collection(FIRESTORE_DB, "users"),
        FIREBASE_AUTH.currentUser.uid
      );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUser({
          ...userData,
          providerId:
            FIREBASE_AUTH.currentUser.providerData?.[0]?.providerId || "",
        } as AuthenticatedUser);
      }
    }
  };

  const updateUsername = async (username: string): Promise<void> => {
    try {
      // Check if username contains spaces
      if (username.includes(" ")) {
        throw new Error("Username cannot contain spaces");
      }

      // Check if username is unique
      const usersCollection = collection(FIRESTORE_DB, "users");
      const q = query(usersCollection, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error(
          "Username is already taken. Please choose another one."
        );
      }

      // Update the user's document with the new username
      if (FIREBASE_AUTH.currentUser) {
        const userDoc = doc(usersCollection, FIREBASE_AUTH.currentUser.uid);
        await setDoc(userDoc, { username }, { merge: true });
        await refreshUser(); // Refresh the user data
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const updateUserProfileImage = (profileUrl: string) => {
    if (user) {
      setUser({
        ...user,
        profileUrl,
      });
    }
  };

  const loginWithApple = async (): Promise<void> => {
    try {
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Only proceed if we have a valid credential
      if (appleCredential.identityToken) {
        const { identityToken, fullName } = appleCredential;
        const provider = new OAuthProvider("apple.com");
        const credential = provider.credential({
          idToken: identityToken,
        });

        const userCredential = await signInWithCredential(
          FIREBASE_AUTH,
          credential
        );
        const newUser = userCredential.user;

        // Check if user exists in Firestore
        const usersCollection = collection(FIRESTORE_DB, "users");
        const userDoc = doc(usersCollection, newUser.uid);
        const userDocSnap = await getDoc(userDoc);

        if (!userDocSnap.exists()) {
          // Create new user document if it doesn't exist
          await setDoc(userDoc, {
            uid: newUser.uid,
            email: newUser.email,
            name: fullName
              ? `${fullName.givenName} ${fullName.familyName}`.trim()
              : "",
            username: "", // Empty username for new users
            profileUrl: newUser.photoURL || "",
            friends: [],
            personalStreak: 0,
            lastInteractionDate: null,
            createdAt: new Date(),
          });
        }
      }
    } catch (error: any) {
      // Check for user cancellation using both possible error codes
      if (
        error.code === "ERR_CANCELED" ||
        (error.message && error.message.includes("canceled"))
      ) {
        // Silently handle cancellation without throwing or logging
        console.log("User cancelled Apple sign-in"); // Optional debug log
        return;
      }

      // For all other errors, log but don't throw
      console.error("Error during Apple sign-in: ", error);
      return; // Return instead of throwing
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        register,
        loginWithGoogle,
        refreshUser,
        updateUsername,
        updateUserProfileImage,
        loginWithApple,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be wrapped inside AuthContext");
  }

  return value;
};
