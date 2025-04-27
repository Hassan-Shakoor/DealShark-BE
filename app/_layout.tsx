import { Stack } from "expo-router";
import "../global.css";
import { ThemeProvider } from "@/app/contexts/useThemeContext";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ApfelGrotezk: require("@/assets/fonts/ApfelGrotezk.otf"),
    Brockmann: require("@/assets/fonts/Brockmann.ttf"),
    Inter: require("@/assets/fonts/Inter.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
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
