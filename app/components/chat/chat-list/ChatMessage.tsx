import { FunctionComponent, useCallback } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { ROUTES } from "@/app/utils/routes";
import { Chat } from "@/app/types/Chat";
import { getAvatarImage } from "@/app/utils/avatar";

type Props = {
  item: Chat;
};

export const ChatMessage: FunctionComponent<Props> = ({ item }) => {
  const handlePress = useCallback(() => {
    router.push(ROUTES.ChatView(item.chat_id));
  }, [item.chat_id]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={
        "flex flex-row items-center gap-2 rounded-lg border border-dark-foreground/10 bg-white py-2.5 pl-6.5 pr-5 dark:bg-dark-foreground/60"
      }
    >
      <Image
        source={getAvatarImage(item.companion_gender ?? "")}
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
            {item.companion_name}
          </Text>
          {!!item.messages.length && (
            <Text className={"font-sfPro text-sm text-appleGrey"}>
              {`${new Date(item.messages[item.messages.length - 1].timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}`}
            </Text>
          )}
        </View>
        {!!item.messages.length && (
          <Text
            className={"font-sfPro text-sm text-appleGrey"}
            numberOfLines={2}
          >
            {item.messages[item.messages.length - 1].content}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
