import { Stack } from "expo-router";
import "../global.css";
import { ThemeProvider } from "@/app/contexts/useThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack />
    </ThemeProvider>
  );
}
