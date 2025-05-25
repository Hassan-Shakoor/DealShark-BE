import { Image, Text, View } from "react-native";
import { AuthBackground } from "@/app/components/theme/AuthBackground";
import { Button } from "@/app/components/ui/Button";
import { router } from "expo-router";
import { ROUTES } from "@/app/utils/routes";
import { useCallback } from "react";
import { CustomSafeArea } from "@/app/components/ui/CustomSafeArea";

export default function AuthHome() {
  const handleContinue = useCallback(() => {
    router.replace(ROUTES.SignUp);
  }, []);

  const handleLogin = useCallback(() => {
    router.replace(ROUTES.SignIn);
  }, []);

  return (
    <AuthBackground>
      <CustomSafeArea>
        <View
          className={
            "flex-1 items-center justify-between gap-2 px-5 pb-11 pt-24"
          }
        >
          {/*Header*/}
          <View className={"flex flex-row gap-2.5"}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={{ width: 60, height: 60 }}
            />
            <Text
              className={
                "font-brockmann text-3xl font-medium text-black dark:text-white"
              }
            >
              Fantasy Ai {"\n"}App
            </Text>
          </View>
          {/*Center Text*/}
          <View className={"flex flex-col items-center gap-1"}>
            <Text
              className={
                "font-sfPro text-2xl font-normal text-secondary dark:text-white"
              }
            >
              Meet your Ai Companion
            </Text>
            <Text
              className={
                "font-sfPro text-3xl font-medium text-black dark:text-white"
              }
            >
              Intimate. Unfiltered. Yours
            </Text>
          </View>
          {/*Button*/}
          <View className={"flex w-full flex-col items-center gap-5"}>
            <Button onPress={handleContinue}>
              <Text className={"font-inter text-white"}>
                Sign up with Email
              </Text>
            </Button>
            <View className={"flex flex-row items-center gap-2"}>
              <Text
                className={
                  "text-medium font-sfPro text-sm text-black dark:text-white"
                }
              >
                Already have an account?
              </Text>
              <Text
                onPress={handleLogin}
                className={"text-medium font-sfPro text-sm text-blue-600"}
              >
                Log in
              </Text>
            </View>
          </View>
        </View>
      </CustomSafeArea>
    </AuthBackground>
  );
}
