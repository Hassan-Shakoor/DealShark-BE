import { FunctionComponent, useCallback } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Chat } from "@/app/data/chat-list";
import { router } from "expo-router";
import { ROUTES } from "@/app/utils/routes";

type Props = {
  item: Chat;
};

export const ChatMessage: FunctionComponent<Props> = ({ item }) => {
  const handlePress = useCallback(() => {
    router.push(ROUTES.ChatView(item.id));
  }, [item.id]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={
        "flex flex-row items-center gap-2 rounded-lg border border-dark-foreground/10 bg-white py-2.5 pl-6.5 pr-5 dark:bg-dark-foreground/60"
      }
    >
      <Image
        source={item.image}
        className={"size-11 rounded-full"}
        resizeMode="contain"
      />
      <View className={"flex flex-1 flex-col"}>
        <View className={"flex flex-row items-center justify-between"}>
          <Text
            className={
              "font-sfPro text-lg font-bold text-black dark:text-white"
            }
          >
            {item.title}
          </Text>
          <Text className={"font-sfPro text-sm text-appleGrey"}>
            {item.date}
          </Text>
        </View>
        <Text className={"font-sfPro text-sm text-appleGrey"} numberOfLines={2}>
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
