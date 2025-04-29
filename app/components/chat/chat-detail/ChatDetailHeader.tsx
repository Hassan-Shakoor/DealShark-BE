import { FunctionComponent, useCallback } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { ROUTES } from "@/app/utils/routes";

export const ChatDetailHeader: FunctionComponent = () => {
  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  const handleProfilePress = useCallback(() => {
    router.push(ROUTES.CompanionSetting);
  }, []);

  return (
    <View
      className={
        "flex w-full flex-row items-center bg-light-tertiary p-2 pt-4 dark:bg-dark-quinary"
      }
    >
      <View>
        <TouchableOpacity onPress={handleBackPress} activeOpacity={0.7}>
          <AntDesign name="left" size={24} color="#545454" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={handleProfilePress}
        className={"flex-1 flex-col gap-1"}
      >
        <Image
          source={require("@/assets/images/chat-header-icon.png")}
          className={"size-12.5 self-center rounded-full"}
        />
        <Text
          className={
            "text-center font-apfelGrotezk text-sm text-black dark:text-white"
          }
        >
          Partner Name
        </Text>
      </TouchableOpacity>
    </View>
  );
};
