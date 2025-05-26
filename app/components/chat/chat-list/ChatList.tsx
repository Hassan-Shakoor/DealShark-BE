import { FlatList } from "react-native";
import { ChatMessage } from "@/app/components/chat/chat-list/ChatMessage";
import { handleError } from "@/app/utils/error-handling";
import { HttpStatusCode } from "axios";
import { APIS } from "@/app/utils/routes";
import { useCallback, useEffect } from "react";
import { api } from "@/app/utils/api";
import { Chat } from "@/app/types/Chat";
import { useChatContext } from "@/app/contexts/useChatContext";
import { ChatAction } from "@/app/contexts/action";

export const ChatList = () => {
  const { state, dispatch } = useChatContext();

  const fetchChatList = useCallback(
    async (searchQuery: string, signal: AbortSignal) => {
      try {
        const response = await api.get<{ chats: Chat[] }>(
          `${APIS.fetchAllChats}?search=${searchQuery}`,
          { signal },
        );

        if (response.status !== HttpStatusCode.Ok) {
          throw new Error(`Failed to fetch chat list`);
        }

        dispatch({
          type: ChatAction.SetChatList,
          payload: response.data.chats,
        });
      } catch (error) {
        handleError(error);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchChatList(state.chatSearchQuery, controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchChatList, state]);

  return (
    <FlatList
      scrollEnabled
      showsVerticalScrollIndicator={false}
      data={state.chatList}
      keyExtractor={(item) => String(item.chat_id)}
      renderItem={({ item }) => <ChatMessage item={item} />}
      contentContainerClassName={"gap-1"}
    />
  );
};
