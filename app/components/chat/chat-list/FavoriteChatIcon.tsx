import { Image, Text, TouchableOpacity } from "react-native";
import { FunctionComponent } from "react";
import { PinnedMessage } from "@/app/types/Chat";

type Props = {
  item: PinnedMessage;
};

export const FavoriteChatIcon: FunctionComponent<Props> = ({ item }) => {
  return (
    <TouchableOpacity className="items-center" activeOpacity={0.7}>
      <Image
        source={require("@/assets/images/johnathan-favorite.png")}
        className={"size-24 rounded-full"}
        resizeMode="contain"
      />
      <Text className="mt-0.5 text-center font-apfelGrotezk text-sm font-normal text-appleGrey">
        {item.companion_name}
      </Text>
    </TouchableOpacity>
  );
};
