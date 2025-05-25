import { FunctionComponent, useCallback, useEffect } from "react";
import { FlatList, View } from "react-native";
import { FavoriteChatIcon } from "@/app/components/chat/chat-list/FavoriteChatIcon";
import { FavoriteChatList } from "@/app/data/favorite-chat-list";
import { api } from "@/app/utils/api";
import { APIS } from "@/app/utils/routes";
import { HttpStatusCode } from "axios";
import { handleError } from "@/app/utils/error-handling";

export const ChatFavoriteList: FunctionComponent = () => {
  const fetchFavoriteChatList = useCallback(async () => {
    try {
      const response = await api.get(APIS.fetchAllPinnedChats);

      if (response.status !== HttpStatusCode.Ok) {
        throw new Error(`Failed to fetch chat list`);
      }

      console.info(response.data.pinned_chats);
    } catch (error) {
      handleError(error);
    }
  }, []);

  useEffect(() => {
    fetchFavoriteChatList();
  }, [fetchFavoriteChatList]);

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
