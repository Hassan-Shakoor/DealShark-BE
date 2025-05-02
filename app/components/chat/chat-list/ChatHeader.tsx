import { FunctionComponent, useCallback } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { ROUTES } from "@/app/utils/routes";

export const ChatHeader: FunctionComponent = () => {
  const handlePress = useCallback(() => {
    router.push(ROUTES.Setting);
  }, []);

  return (
    <View className={"relative flex w-full flex-row items-center px-5 py-6"}>
      <Text
        className={
          "font-sfPro w-full text-center text-2xl font-medium text-black dark:text-white"
        }
      >
        My Chats
      </Text>
      <TouchableOpacity
        onPress={handlePress}
        className={
          "right-6 rounded-lg bg-light-foreground p-1.5 dark:bg-dark-secondary"
        }
      >
        <Image
          source={require("@/assets/images/setting-icon.png")}
          style={{ width: 21, height: 21 }}
        />
      </TouchableOpacity>
    </View>
  );
};
