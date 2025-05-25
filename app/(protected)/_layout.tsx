import { Redirect, Stack } from "expo-router";
import { useAuthContext } from "@/app/contexts/useAuthContext";
import { ROUTES } from "@/app/utils/routes";
import { ChatProvider } from "@/app/contexts/useChatContext";

export default function ProtectedLayout() {
  const { state } = useAuthContext();

  if (!state.isReady) {
    null;
  }

  if (!state.isLogin) {
    return <Redirect href={ROUTES.AuthHome} />;
  }

  return (
    <ChatProvider>
      <Stack>
        <Stack.Screen name={"(chat)"} options={{ headerShown: false }} />
        <Stack.Screen
          name={"terms-and-condition"}
          options={{ headerShown: false }}
        />
        <Stack.Screen name={"purchase"} options={{ headerShown: false }} />
        <Stack.Screen name={"setting"} options={{ headerShown: false }} />
        <Stack.Screen
          name={"companion-setting"}
          options={{ headerShown: false }}
        />
      </Stack>
    </ChatProvider>
  );
}
