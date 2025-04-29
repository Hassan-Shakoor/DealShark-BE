import { TouchableOpacity, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import { useCallback } from "react";

export const PurchaseHeader = () => {
  const handleClose = useCallback(() => {
    router.back();
  }, []);

  return (
    <View className={"flex w-full flex-row justify-end px-4 py-6"}>
      <TouchableOpacity
        onPress={handleClose}
        className={
          "rounded-lg bg-light-foreground p-1.5 dark:bg-dark-secondary"
        }
      >
        <Entypo name="cross" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};
