import { FunctionComponent, useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

export const CompanionSettingHeader: FunctionComponent = () => {
  const handleClose = useCallback(() => {
    router.back();
  }, []);

  return (
    <View className={"flex w-full flex-row items-center p-6"}>
      <View className={"flex-1 flex-col gap-1"}>
        <Text
          className={
            "w-full text-center font-inter text-2xl font-medium text-black dark:text-white"
          }
        >
          My Companion
        </Text>
      </View>
      <View>
        <TouchableOpacity
          onPress={handleClose}
          className={
            "rounded-lg bg-light-foreground p-1.5 dark:bg-dark-secondary"
          }
        >
          <Entypo name="cross" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
