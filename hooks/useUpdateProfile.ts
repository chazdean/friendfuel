import { useState } from "react";
import { AccountSettingsInputs } from "@/app/(app)/(tabs)/(profile)/account-settings";
import { updateUserProfile } from "@/firebaseServices/user";

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (
    userId: string,
    data: AccountSettingsInputs,
    isGoogleUser: boolean
  ) => {
    setLoading(true);
    setError(null);

    try {
      const updates = {
        username: data.username,
        name: data.name,
        ...(isGoogleUser
          ? {}
          : {
              email: data.email,
              ...(data.password ? { password: data.password } : {}),
            }),
      };

      await updateUserProfile(userId, updates, isGoogleUser);
      return true;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading, error };
};
