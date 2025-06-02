import { FlatList } from "react-native";
import { ChatMessage } from "@/app/components/chat/chat-list/ChatMessage";
import { handleError } from "@/app/utils/error-handling";
import { HttpStatusCode } from "axios";
import { APIS } from "@/app/utils/routes";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/app/utils/api";
import { Chat } from "@/app/types/Chat";
import { useChatContext } from "@/app/contexts/useChatContext";
import { ChatAction } from "@/app/contexts/action";
import Loader from "@/app/components/ui/Loader";

export const ChatList = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { state, dispatch } = useChatContext();

  const fetchChatList = useCallback(
    async (searchQuery: string, signal: AbortSignal) => {
      try {
        setLoading(true);

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
      } finally {
        setLoading(false);
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
  }, [fetchChatList, state.chatSearchQuery, state.companionSetting]);

  return isLoading ? (
    <Loader size={"small"} />
  ) : (
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
