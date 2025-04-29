import { FunctionComponent } from "react";
import { Image, Text, View } from "react-native";

export const ImageSection: FunctionComponent = () => {
  return (
    <View className={"flex flex-col items-center gap-2"}>
      <Image
        source={require("@/assets/images/chat-header-icon.png")}
        className={"size-20 self-center rounded-full"}
      />
      <View className={"flex flex-row items-center gap-1"}>
        <Text
          className={
            "font-brockmann text-2xl font-medium text-black dark:text-white"
          }
        >
          Kara
        </Text>
        <Image
          source={require("@/assets/images/cross-icon.png")}
          className={"size-6"}
        />
      </View>
    </View>
  );
};
