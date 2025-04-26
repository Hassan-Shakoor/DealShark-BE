import { Stack } from "expo-router";
import "../global.css";
import { ThemeProvider } from "@/app/contexts/useThemeContext";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

export default function RootLayout() {
  const [loaded] = useFonts({
    ApfelGrotezk: require("@/assets/fonts/ApfelGrotezk.otf"),
    Brockmann: require("@/assets/fonts/Brockmann.ttf"),
    Inter: require("@/assets/fonts/Inter.ttf"),
  });

  if (!loaded) {
    console.log("Loading layout...");
  }

  return (
    <ThemeProvider>
      <StatusBar />
      <Stack>
        <Stack.Screen name={"index"} options={{ headerShown: false }} />
        <Stack.Screen name={"(auth)"} options={{ headerShown: false }} />
        <Stack.Screen
          name={"terms-and-condition"}
          options={{ headerShown: false }}
        />
      </Stack>
    </ThemeProvider>
  );
}
