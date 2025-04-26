import { Image, SafeAreaView, Text, View } from "react-native";
import { AuthBackground } from "@/app/components/theme/AuthBackground";
import { Button } from "@/app/components/ui/Button";
import { Link, router } from "expo-router";
import { ROUTES } from "@/app/utils/routes";
import { useCallback } from "react";

export default function Index() {
  const handleContinue = useCallback(() => {
    router.push(ROUTES.SignUp);
  }, []);

  return (
    <AuthBackground>
      <SafeAreaView className={"flex-1"}>
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
                "text-secondary font-apfelGrotezk text-2xl font-normal dark:text-white"
              }
            >
              Meet your Ai Companion
            </Text>
            <Text
              className={
                "font-brockmann text-3xl font-medium text-black dark:text-white"
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
                  "text-medium font-inter text-sm text-black dark:text-white"
                }
              >
                Already have an account?
              </Text>
              <Link
                href={ROUTES.SignIn}
                className={"text-medium font-inter text-sm text-blue-600"}
              >
                Log in
              </Link>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </AuthBackground>
  );
}
