import { ReactElement } from "react";
import { Stack } from "expo-router";

const ChatLayout = (): ReactElement => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name={"index"} options={{ headerShown: false }} />
      <Stack.Screen name={"[id]"} options={{ headerShown: false }} />
    </Stack>
  );
};

export default ChatLayout;
