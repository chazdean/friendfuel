// Import your global CSS file
import { AuthContextProvider, useAuth } from "@/context/authContext";
import "../global.css";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { useNotifications } from "@/hooks/useNotifications";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient();

const MainLayout = () => {
  const { isAuthenticated, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  useNotifications();

  useEffect(() => {
    // Wait for both auth state and user data to be loaded
    if (isAuthenticated === undefined || user === undefined) return;

    const inApp = segments[0] === "(app)";
    const inAuth =
      segments[0] === "login" ||
      segments[0] === "register" ||
      segments[0] === "home";

    if (isAuthenticated && user) {
      // If user has username but isn't in the app, redirect to app
      if (user?.username && !inApp) {
        router.replace("/(app)");
        // If user is authenticated but has no username, redirect to username setup
      } else if (!user?.username && !inApp) {
        router.replace("/(app)/username-setup");
      }
    } else if (isAuthenticated === false && !inAuth) {
      // Only redirect if we're not already on an auth screen
      router.replace("/home");
    }
  }, [isAuthenticated, user?.username, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="home" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
};

export default function RootLayout() {
  useReactQueryDevTools(queryClient);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <AuthContextProvider>
            <MainLayout />
          </AuthContextProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
