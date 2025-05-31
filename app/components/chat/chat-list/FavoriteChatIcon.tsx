import { Image, Text, TouchableOpacity } from "react-native";
import { FunctionComponent, useCallback } from "react";
import { PinnedMessage } from "@/app/types/Chat";
import { router } from "expo-router";
import { ROUTES } from "@/app/utils/routes";

type Props = {
  item: PinnedMessage;
};

export const FavoriteChatIcon: FunctionComponent<Props> = ({ item }) => {
  const handleFavoriteChatPress = useCallback(() => {
    router.push(ROUTES.ChatView(item.chat_id));
  }, [item.chat_id]);

  return (
    <TouchableOpacity
      className="items-center"
      activeOpacity={0.7}
      onPress={handleFavoriteChatPress}
    >
      <Image
        source={
          item.companion_gender === "male"
            ? require("@/assets/images/male-avatar.png")
            : require("@/assets/images/female-avatar.png")
        }
        className={"size-24 rounded-full"}
        resizeMode="contain"
      />
      <Text className="mt-0.5 text-center font-apfelGrotezk text-sm font-normal text-appleGrey">
        {item.companion_name}
      </Text>
    </TouchableOpacity>
  );
};
