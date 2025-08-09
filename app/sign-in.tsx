import { FunctionComponent, useCallback, useState } from "react";
import {
  Image,
  Pressable,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AuthBackground } from "@/app/components/theme/AuthBackground";
import { Feather } from "@expo/vector-icons";
import { Button } from "@/app/components/ui/Button";
import { router } from "expo-router";
import { APIS, ROUTES } from "@/app/utils/routes";
import { CustomSafeArea } from "@/app/components/ui/CustomSafeArea";
import { api } from "@/app/utils/api";
import { HttpStatusCode } from "axios";
import { AsyncStorageKey } from "@/app/utils/constant";
import { useAuthContext } from "@/app/contexts/useAuthContext";
import { AuthAction } from "@/app/contexts/action";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleError } from "@/app/utils/error-handling";
import Loader from "@/app/components/ui/Loader";

const SignIn: FunctionComponent = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const { dispatch } = useAuthContext();

  const handleContinue = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.post(APIS.signIn, {
        user_email: username.toLowerCase(),
        password,
      });

      if (response.status !== HttpStatusCode.Ok) {
        throw new Error("Failed to sign in");
      }

      console.info(response.data);
      await AsyncStorage.setItem(
        AsyncStorageKey.Token,
        response.data.access_token,
      );
      dispatch({
        type: AuthAction.SetLoggedIn,
        payload: response.data.access_token,
      });
      router.replace(ROUTES.Chat);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, password, username]);

  const handleSignUp = useCallback(() => {
    router.replace(ROUTES.SignUp);
  }, []);

  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  return (
    <AuthBackground>
      <CustomSafeArea>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className={"flex flex-col px-5 pt-24"}>
                {/*Header*/}
                <View className={"flex flex-row gap-2.5 self-center"}>
                  <Image
                    source={require("@/assets/images/icon.png")}
                    style={{ width: 60, height: 60 }}
                  />
                  <Text
                    className={
                      "font-inter text-3xl font-medium text-black dark:text-white"
                    }
                  >
                    Fantasy Ai {"\n"}App
                  </Text>
                </View>
                {/*Form*/}
                <View className={"flex flex-col gap-5 pt-14"}>
                  <Text
                    className={"font-sfPro text-3xl font-medium text-white"}
                  >
                    Sign In
                  </Text>
                  <View className={"flex flex-col gap-2"}>
                    <TextInput
                      className={"w-full rounded-lg bg-white/60 p-3 py-5"}
                      placeholder={"username@example.com"}
                      placeholderTextColor={"#1A1C1E"}
                      keyboardType={"email-address"}
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    {/* Password Input */}
                    <View className="relative w-full">
                      <TextInput
                        className={"w-full rounded-lg bg-white/60 p-3 py-5"}
                        placeholder="Password"
                        placeholderTextColor={"#1A1C1E"}
                        secureTextEntry={!isPasswordVisible}
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <Pressable
                        onPress={() => setPasswordVisible(!isPasswordVisible)}
                        className="absolute right-3 top-5"
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
                <View
                  className={"mt-9 flex w-full flex-col items-center gap-5"}
                >
                  <Button
                    onPress={handleContinue}
                    disabled={!username.length || !password.length}
                  >
                    <Text className={"font-sfPro text-white"}>
                      {isLoading ? <Loader size={"small"} /> : "Continue"}
                    </Text>
                  </Button>
                  <View className={"flex flex-row items-center gap-2"}>
                    <Text
                      className={
                        "text-medium font-sfPro text-sm text-black dark:text-white"
                      }
                    >
                      Don't have an account?
                    </Text>
                    <Text
                      onPress={handleSignUp}
                      className={"text-medium font-sfPro text-sm text-blue-600"}
                    >
                      Create new one
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </CustomSafeArea>
    </AuthBackground>
  );
};

export default SignIn;
