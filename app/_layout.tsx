import "../global.css";
import { AuthProvider } from "@/app/contexts/useAuthContext";
import LayoutContent from "@/app/components/layout/LayoutContent";
import Toast from "react-native-toast-message";
import { useEffect } from "react";
import { Platform } from "react-native";
import { Helmet } from "react-helmet";

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "web") {
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
          navigator.serviceWorker
            .register("/sw.js", {
              scope: "/",
            })
            .then((registration) => {
              console.log("SW registered: ", registration);
            })
            .catch((registrationError) => {
              console.log("SW registration failed: ", registrationError);
            });
        });
      }
    }
  }, []);
  return (
    <AuthProvider>
      <Helmet>
        <title>Fantasy App</title>
        <meta name="description" content="Fantasy App an AI Companion" />
        <meta property="og:title" content="Fantasy App" />
        <meta property="og:description" content="Fantasy App an AI Companion" />
        <meta property="og:image" content="https://example.com/og-image.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Fantasy App" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="manifest" href="manifest.json" />
      </Helmet>
      <LayoutContent />
      <Toast />
    </AuthProvider>
  );
}
