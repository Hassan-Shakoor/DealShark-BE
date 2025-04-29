import { CustomSafeArea } from "@/app/components/ui/CustomSafeArea";
import { AuthBackground } from "@/app/components/theme/AuthBackground";
import { SettingHeader } from "@/app/components/setting/SettingHeader";
import { Text, TouchableOpacity, View } from "react-native";
import { PurchaseBanner } from "@/app/components/setting/PurchaseBanner";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useColorScheme } from "nativewind";
import { Theme } from "@/app/utils/constant";
import { useThemeContext } from "@/app/contexts/useThemeContext";
import { ThemeAction } from "@/app/contexts/action";
import { useCallback } from "react";

const Setting = () => {
  const { dispatch } = useThemeContext();
  const { colorScheme } = useColorScheme();

  const handleToggleTheme = useCallback(() => {
    dispatch({
      type: ThemeAction.SetTheme,
      payload: colorScheme === Theme.Dark ? Theme.Light : Theme.Dark,
    });
  }, [colorScheme, dispatch]);

  return (
    <AuthBackground>
      <CustomSafeArea>
        <SettingHeader />
        <View className={"flex flex-1 flex-col gap-6.5 px-6"}>
          <PurchaseBanner />
          <View className={"flex flex-col gap-1"}>
            <TouchableOpacity
              activeOpacity={0.7}
              className={
                "px-4.5 py-5.5 dark:bg-dark-septenary/50 flex flex-row items-center justify-between rounded-xl bg-white/50"
              }
            >
              <Text
                className={
                  "font-apfelGrotezk text-lg text-black dark:text-white"
                }
              >
                Account
              </Text>
              <AntDesign
                name="right"
                size={14}
                color={colorScheme === Theme.Dark ? "#CDC3C3" : "#000000"}
              />
            </TouchableOpacity>
            <View
              className={
                "px-4.5 py-5.5 dark:bg-dark-septenary/50 flex flex-row items-center justify-between rounded-xl bg-white/50"
              }
            >
              <Text
                className={
                  "font-apfelGrotezk text-lg text-black dark:text-white"
                }
              >
                App Version
              </Text>
              <Text
                className={
                  "font-apfelGrotezk text-sm text-black dark:text-white"
                }
              >
                v2.4
              </Text>
            </View>
            <View
              className={
                "px-4.5 py-5.5 dark:bg-dark-septenary/50 flex flex-row items-center justify-between rounded-xl bg-white/50"
              }
            >
              <Text
                className={
                  "font-apfelGrotezk text-lg text-black dark:text-white"
                }
              >
                App Language
              </Text>
              <Text
                className={
                  "font-apfelGrotezk text-sm text-black dark:text-white"
                }
              >
                English
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleToggleTheme}
              activeOpacity={0.7}
              className={
                "px-4.5 py-5.5 dark:bg-dark-septenary/50 flex flex-row items-center justify-between rounded-xl bg-white/50"
              }
            >
              <Text
                className={
                  "font-apfelGrotezk text-lg text-black dark:text-white"
                }
              >
                Theme
              </Text>
              <Text
                className={
                  "font-apfelGrotezk text-sm capitalize text-black dark:text-white"
                }
              >
                {`${colorScheme}` + " mode"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomSafeArea>
    </AuthBackground>
  );
};

export default Setting;
