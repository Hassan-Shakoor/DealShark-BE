import { FunctionComponent } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export const ChatHeader: FunctionComponent = () => {
  return (
    <View className={"relative flex w-full flex-row items-center px-5 py-6"}>
      <Text
        className={
          "w-full text-center font-brockmann text-2xl font-medium text-black dark:text-white"
        }
      >
        My Chats
      </Text>
      <TouchableOpacity
        className={
          "bg-light-foreground right-6 rounded-lg p-1.5 dark:bg-dark-secondary"
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
