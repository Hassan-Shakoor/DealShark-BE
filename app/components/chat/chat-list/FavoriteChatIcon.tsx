import { Image, Text, TouchableOpacity, View } from "react-native";
import { FunctionComponent } from "react";
import { FavoriteChat } from "@/app/data/favorite-chat-list";

type Props = {
  item: FavoriteChat;
};

export const FavoriteChatIcon: FunctionComponent<Props> = ({ item }) => {
  return (
    <TouchableOpacity className="items-center" activeOpacity={0.7}>
      <Image
        source={require("@/assets/images/react-logo.png")}
        className={"size-24 rounded-full"}
        resizeMode="contain"
      />
      <Text className="mt-0.5 text-center font-apfelGrotezk text-sm font-normal text-appleGrey">
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};
