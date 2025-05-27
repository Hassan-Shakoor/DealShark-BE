import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { ThemeProvider } from "@/app/contexts/useThemeContext";
import { useAuthContext } from "@/app/contexts/useAuthContext";

const LayoutContent = () => {
  const [loaded, error] = useFonts({
    ApfelGrotezk: require("@/assets/fonts/ApfelGrotezk.otf"),
    Brockmann: require("@/assets/fonts/Brockmann.ttf"),
    Inter: require("@/assets/fonts/Inter.ttf"),
    Poppins: require("@/assets/fonts/Poppins.ttf"),
    SFPro: require("@/assets/fonts/SFPro.ttf"),
  });

  const { state } = useAuthContext();

  useEffect(() => {
    if ((loaded || error) && state.isReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, state.isReady]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider>
      <StatusBar />
      <Stack>
        <Stack.Screen name={"(protected)"} options={{ headerShown: false }} />
        <Stack.Screen name={"auth-home"} options={{ headerShown: false }} />
        <Stack.Screen name={"sign-in"} options={{ headerShown: false }} />
        <Stack.Screen name={"sign-up"} options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
};

export default LayoutContent;
