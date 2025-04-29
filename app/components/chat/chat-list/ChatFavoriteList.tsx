import { FunctionComponent } from "react";
import { FlatList, View } from "react-native";
import { FavoriteChatIcon } from "@/app/components/chat/chat-list/FavoriteChatIcon";
import { FavoriteChatList } from "@/app/data/favorite-chat-list";

export const ChatFavoriteList: FunctionComponent = () => {
  return (
    <View className={"my-5"}>
      <FlatList
        horizontal
        data={FavoriteChatList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FavoriteChatIcon item={item} />}
        contentContainerClassName={"gap-5"}
      />
    </View>
  );
};
