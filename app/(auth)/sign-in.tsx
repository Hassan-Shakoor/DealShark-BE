import { FunctionComponent, useCallback, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import { AuthBackground } from "../components/theme/AuthBackground";
import { Feather } from "@expo/vector-icons";
import { Button } from "@/app/components/ui/Button";
import { Link, router } from "expo-router";
import { ROUTES } from "@/app/utils/routes";

const SignIn: FunctionComponent = () => {
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);

  const handleContinue = useCallback(() => {
    router.push(ROUTES.TermsAndConditions);
  }, []);

  return (
    <AuthBackground>
      <SafeAreaView className={"flex-1"}>
        <View className={"flex flex-col px-5 pt-24"}>
          {/*Header*/}
          <View className={"flex flex-row gap-2.5 self-center"}>
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
          {/*Form*/}
          <View className={"flex flex-col gap-5 pt-14"}>
            <Text className={"font-brockmann text-3xl font-medium text-white"}>
              Sign In
            </Text>
            <View className={"flex flex-col gap-2"}>
              <TextInput
                className={"w-full rounded-lg bg-white/60 p-3"}
                placeholder={"username@example.com"}
                placeholderTextColor={"#1A1C1E"}
                keyboardType={"email-address"}
              />
              {/* Password Input */}
              <View className="relative w-full">
                <TextInput
                  className={"w-full rounded-lg bg-white/60 p-3"}
                  placeholder="Password"
                  placeholderTextColor={"#1A1C1E"}
                  secureTextEntry={!isPasswordVisible}
                />
                <Pressable
                  onPress={() => setPasswordVisible(!isPasswordVisible)}
                  className="absolute right-3 top-3"
                >
                  <Feather
                    name={isPasswordVisible ? "eye-off" : "eye"}
                    size={20}
                  />
                </Pressable>
              </View>
            </View>
          </View>
          {/*Button*/}
          <View className={"mt-9 flex w-full flex-col items-center gap-5"}>
            <Button onPress={handleContinue}>
              <Text className={"font-inter text-white"}>Continue</Text>
            </Button>
            <View className={"flex flex-row items-center gap-2"}>
              <Text
                className={
                  "text-medium font-inter text-sm text-black dark:text-white"
                }
              >
                Don't have an account?
              </Text>
              <Link
                href={ROUTES.SignUp}
                className={"text-medium font-inter text-sm text-blue-600"}
              >
                Create new one
              </Link>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </AuthBackground>
  );
};

export default SignIn;
