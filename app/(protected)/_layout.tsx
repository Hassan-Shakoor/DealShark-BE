import { Redirect, Stack } from "expo-router";
import { useAuthContext } from "@/app/contexts/useAuthContext";
import { ROUTES } from "@/app/utils/routes";

export default function ProtectedLayout() {
  const { state } = useAuthContext();

  console.log(state);

  if (!state.isReady) {
    null;
  }

  if (!state.isLogin) {
    return <Redirect href={ROUTES.AuthHome} />;
  }

  return (
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
  );
}
