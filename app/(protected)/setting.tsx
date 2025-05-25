import { CustomSafeArea } from "@/app/components/ui/CustomSafeArea";
import { AuthBackground } from "@/app/components/theme/AuthBackground";
import { SettingHeader } from "@/app/components/setting/SettingHeader";
import { Text, TouchableOpacity, View } from "react-native";
import { PurchaseBanner } from "@/app/components/setting/PurchaseBanner";
import { useColorScheme } from "nativewind";
import { AsyncStorageKey, Theme } from "@/app/utils/constant";
import { useThemeContext } from "@/app/contexts/useThemeContext";
import { AuthAction, ThemeAction } from "@/app/contexts/action";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { useAuthContext } from "@/app/contexts/useAuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleError } from "@/app/utils/error-handling";
import { api } from "@/app/utils/api";
import { APIS } from "@/app/utils/routes";
import { HttpStatusCode } from "axios";
import { UserSetting } from "@/app/types/setting";

const Setting = () => {
  const [userSetting, setUserSetting] = useState<UserSetting | null>(null);

  const { dispatch } = useThemeContext();
  const { colorScheme } = useColorScheme();
  const { dispatch: authDispatch } = useAuthContext();

  const fetchUserSetting = useCallback(async () => {
    try {
      const response = await api.get<UserSetting>(APIS.fetchUserSetting);

      if (response.status !== HttpStatusCode.Ok) {
        throw new Error("Failed to fetch user settings");
      }

      setUserSetting(response.data);
    } catch (error) {
      handleError(error);
    }
  }, []);

  const handleToggleTheme = useCallback(() => {
    dispatch({
      type: ThemeAction.SetTheme,
      payload: colorScheme === Theme.Dark ? Theme.Light : Theme.Dark,
    });
  }, [colorScheme, dispatch]);

  const handleLogOut = useCallback(() => {
    authDispatch({ type: AuthAction.SetLoggedIn, payload: null });
    AsyncStorage.removeItem(AsyncStorageKey.Token);
  }, [authDispatch]);

  useEffect(() => {
    fetchUserSetting();
  }, [fetchUserSetting]);

  return (
    <AuthBackground>
      <CustomSafeArea classNames={"flex flex-col"}>
        <SettingHeader />
        <View className={"flex flex-1 flex-col gap-6.5 px-6"}>
          <PurchaseBanner />
          <View className={"flex flex-col gap-1"}>
            {/*<TouchableOpacity*/}
            {/*  activeOpacity={0.7}*/}
            {/*  className={*/}
            {/*    "flex flex-row items-center justify-between rounded-xl bg-white/50 px-4.5 py-5.5 dark:bg-dark-septenary/50"*/}
            {/*  }*/}
            {/*>*/}
            {/*  <Text className={"font-sfPro text-lg text-black dark:text-white"}>*/}
            {/*    Account*/}
            {/*  </Text>*/}
            {/*  <AntDesign*/}
            {/*    name="right"*/}
            {/*    size={14}*/}
            {/*    color={colorScheme === Theme.Dark ? "#CDC3C3" : "#000000"}*/}
            {/*  />*/}
            {/*</TouchableOpacity>*/}
            <View
              className={
                "flex flex-row items-center justify-between rounded-xl bg-white/50 px-4.5 py-5.5 dark:bg-dark-septenary/50"
              }
            >
              <Text className={"font-sfPro text-lg text-black dark:text-white"}>
                App Version
              </Text>
              <Text className={"font-sfPro text-sm text-black dark:text-white"}>
                {userSetting?.app_version ?? "Loading ..."}
              </Text>
            </View>
            <View
              className={
                "flex flex-row items-center justify-between rounded-xl bg-white/50 px-4.5 py-5.5 dark:bg-dark-septenary/50"
              }
            >
              <Text className={"font-sfPro text-lg text-black dark:text-white"}>
                App Language
              </Text>
              <Text className={"font-sfPro text-sm text-black dark:text-white"}>
                {userSetting?.app_language ?? "Loading ..."}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleToggleTheme}
              activeOpacity={0.7}
              className={
                "flex flex-row items-center justify-between rounded-xl bg-white/50 px-4.5 py-5.5 dark:bg-dark-septenary/50"
              }
            >
              <Text className={"font-sfPro text-lg text-black dark:text-white"}>
                Theme
              </Text>
              <Text
                className={
                  "font-sfPro text-sm capitalize text-black dark:text-white"
                }
              >
                {`${colorScheme}` + " mode"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className={"mb-12 px-6"}>
          <Button onPress={handleLogOut} variant={"danger"}>
            <Text className={"font-sfPro text-white"}>Log out</Text>
          </Button>
        </View>
      </CustomSafeArea>
    </AuthBackground>
  );
};

export default Setting;
