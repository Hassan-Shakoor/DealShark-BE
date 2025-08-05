import React, { useCallback, useEffect } from "react";
import { View, Text, Platform } from "react-native";
import { router } from "expo-router";
import { Button } from "@/app/components/ui/Button";
import { CustomSafeArea } from "@/app/components/ui/CustomSafeArea";
import { ROUTES } from "@/app/utils/routes";

export default function Index() {
  console.log("Index component rendered");

  const handleStart = useCallback(() => {
    console.log("Get Started button pressed");
    router.replace(ROUTES.AuthHome);
  }, []);

  // useEffect(() => {
  //   console.log("Index component mounted");
  //   if (Platform.OS === "web") {
  //     if ("serviceWorker" in navigator) {
  //       window.addEventListener("load", () => {
  //         navigator.serviceWorker
  //           .register("/sw.js", {
  //             scope: "/",
  //           })
  //           .then((registration) => {
  //             console.log("SW registered: ", registration);
  //           })
  //           .catch((registrationError) => {
  //             console.log("SW registration failed: ", registrationError);
  //           });
  //       });
  //     }
  //   }
  // }, []);

  console.log("Index component about to render JSX");

  return (
    <CustomSafeArea>
      <View
        className={
          "flex-1 items-center justify-center bg-white p-5 dark:bg-black"
        }
      >
        <Text
          className={
            "mb-8 text-center font-sfPro text-3xl font-bold text-black dark:text-white"
          }
        >
          Welcome to the {"\n"}Fantasy Ai App
        </Text>

        <Button onPress={handleStart}>
          <Text className={"font-inter text-white"}>Get Started</Text>
        </Button>
      </View>
    </CustomSafeArea>
  );
}
