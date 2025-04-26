import { Stack } from "expo-router";
import "../global.css";
import { ThemeProvider } from "@/app/contexts/useThemeContext";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBar />
      <Stack>
        <Stack.Screen name={"index"} options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
