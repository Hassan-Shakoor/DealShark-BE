import { ChatBackground } from "@/app/components/theme/ChatBackground";
import { CustomSafeArea } from "@/app/components/ui/CustomSafeArea";
import { ChatDetailHeader } from "@/app/components/chat/chat-detail/ChatDetailHeader";
import { MessageList } from "@/app/components/chat/chat-detail/MessageList";
import { KeyboardSection } from "@/app/components/chat/chat-detail/KeyboardSection";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/app/utils/api";
import { Chat } from "@/app/types/Chat";
import { APIS } from "@/app/utils/routes";
import { HttpStatusCode } from "axios";
import { ChatAction } from "@/app/contexts/action";
import { handleError } from "@/app/utils/error-handling";
import { useChatContext } from "@/app/contexts/useChatContext";
import { useLocalSearchParams } from "expo-router";

const ChatView = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const param = useLocalSearchParams();
  const id: string = Array.isArray(param.id) ? param.id[0] : param.id;
  const { dispatch } = useChatContext();

  const fetchIndividualChatList = useCallback(async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, [dispatch, id]);

  useEffect(() => {
    fetchIndividualChatList();
  }, [fetchIndividualChatList]);

  return (
    <ChatBackground>
      <CustomSafeArea classNames={"flex flex-col"}>
        <ChatDetailHeader loading={isLoading} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <MessageList />
          <KeyboardSection />
        </KeyboardAvoidingView>
      </CustomSafeArea>
    </ChatBackground>
  );
};

export default ChatView;
