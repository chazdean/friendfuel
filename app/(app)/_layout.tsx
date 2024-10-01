import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="chat/[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="friend-stats/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="friend-select"
        options={{
          headerShown: false,
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="questions"
        options={{ headerShown: false, presentation: "card" }}
      />
      <Stack.Screen
        name="question-help"
        options={{ headerShown: false, presentation: "card" }}
      />
      <Stack.Screen name="streak" options={{ headerShown: false }} />
      <Stack.Screen
        name="username-setup"
        options={{ headerShown: false, presentation: "card" }}
      />
    </Stack>
  );
}
