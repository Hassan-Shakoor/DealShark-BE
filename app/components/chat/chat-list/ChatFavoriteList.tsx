import { FunctionComponent, useCallback, useEffect } from "react";
import { FlatList, View } from "react-native";
import { FavoriteChatIcon } from "@/app/components/chat/chat-list/FavoriteChatIcon";
import { api } from "@/app/utils/api";
import { APIS } from "@/app/utils/routes";
import { HttpStatusCode } from "axios";
import { handleError } from "@/app/utils/error-handling";
import { useChatContext } from "@/app/contexts/useChatContext";
import { ChatAction } from "@/app/contexts/action";

export const ChatFavoriteList: FunctionComponent = () => {
  const { state, dispatch } = useChatContext();

  const fetchFavoriteChatList = useCallback(async () => {
    try {
      const response = await api.get(APIS.fetchAllPinnedChats);

      if (response.status !== HttpStatusCode.Ok) {
        throw new Error(`Failed to fetch chat list`);
      }

      console.info(response.data.pinned_chats);
      dispatch({
        type: ChatAction.SetPinnedChats,
        payload: response.data.pinned_chats,
      });
    } catch (error) {
      handleError(error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchFavoriteChatList();
  }, [fetchFavoriteChatList]);

  return (
    <View className={"my-5"}>
      <FlatList
        horizontal
        data={state.pinnedChats}
        keyExtractor={(item) => String(item.chat_id)}
        renderItem={({ item }) => <FavoriteChatIcon item={item} />}
        contentContainerClassName={"gap-5"}
      />
    </View>
  );
};
