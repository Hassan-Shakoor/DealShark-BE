import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { UserMessage } from "@/app/components/chat/chat-detail/UserMessage";
import { FlatList, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { api } from "@/app/utils/api";
import { APIS } from "@/app/utils/routes";
import { HttpStatusCode } from "axios";
import { handleError } from "@/app/utils/error-handling";
import { useChatContext } from "@/app/contexts/useChatContext";
import { ChatAction } from "@/app/contexts/action";
import { Chat, Message, MessageRole } from "@/app/types/Chat";

export const MessageList: FunctionComponent = () => {
  // Create a ref for the FlatList component
  const param = useLocalSearchParams();
  const id: string = Array.isArray(param.id) ? param.id[0] : param.id;
  const flatListRef = useRef<FlatList<Message>>(null);
  const { state, dispatch } = useChatContext();

  const fetchIndividualChatList = useCallback(async () => {
    try {
      const response = await api.get<Chat>(APIS.fetchIndividualChat(id));

      if (response.status !== HttpStatusCode.Ok) {
        throw new Error(`Failed to fetch chat`);
      }

      console.info(response.data);
      dispatch({
        type: ChatAction.SetIndividualMessage,
        payload: response.data,
      });
    } catch (error) {
      handleError(error);
    }
  }, [dispatch, id]);

  useEffect(() => {
    fetchIndividualChatList();
  }, [fetchIndividualChatList]);

  // Scroll to the end whenever messages change
  useEffect(() => {
    // Use a timeout to ensure the FlatList has rendered
    const timer = setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: false });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const dataWithLoading = useMemo(() => {
    if (state.waitingForResponse) {
      return [
        ...(state.individualMessage?.messages ?? []),
        {
          content: "loading",
          role: MessageRole.Assistant,
          timestamp: new Date().toISOString(),
        },
      ];
    }

    return state.individualMessage?.messages ?? [];
  }, [state.individualMessage?.messages, state.waitingForResponse]);

  return (
    <View className={"flex-1 px-3.5"}>
      <FlatList
        ref={flatListRef}
        scrollEnabled
        showsVerticalScrollIndicator={false}
        data={dataWithLoading}
        renderItem={({ item }) => <UserMessage message={item} />}
        contentContainerClassName={"gap-3 pb-4"}
        // Simple event handlers that directly call scrollToEnd on the ref
        onContentSizeChange={() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: false });
          }
        }}
        onLayout={() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: false });
          }
        }}
      />
    </View>
  );
};
