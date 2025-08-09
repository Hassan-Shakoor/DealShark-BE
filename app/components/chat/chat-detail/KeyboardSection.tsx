import { FunctionComponent, useCallback, useMemo, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { APIS } from "@/app/utils/routes";
import { useChatContext } from "@/app/contexts/useChatContext";
import { handleError } from "@/app/utils/error-handling";
import { api } from "@/app/utils/api";
import { HttpStatusCode } from "axios";
import { Chat, Message, MessageRole } from "@/app/types/Chat";
import { ChatAction } from "@/app/contexts/action";
import { retryApiCall } from "@/app/utils/retry-mechanism";

export const KeyboardSection: FunctionComponent = () => {
  const param = useLocalSearchParams();
  const id: string = Array.isArray(param.id) ? param.id[0] : param.id;
  const [messageText, setMessageText] = useState<string>("");
  const { state, dispatch } = useChatContext();

  const fetchIndividualChatList = useCallback(async () => {
    try {
      const response = await api.get<Chat>(APIS.fetchIndividualChat(id));

      if (response.status !== HttpStatusCode.Ok) {
        throw new Error(`Failed to fetch chat`);
      }

      console.info(response.data);
      dispatch({
        type: ChatAction.SetWaitingForResponse,
        payload: false,
      });
      dispatch({
        type: ChatAction.SetIndividualMessage,
        payload: response.data,
      });
    } catch (error) {
      handleError(error);
    }
  }, [dispatch, id]);

  const handleSendMessage = useCallback(async () => {
    try {
      dispatch({
        type: ChatAction.SetWaitingForResponse,
        payload: true,
      });
      setMessageText("");
      dispatch({
        type: ChatAction.SetIndividualMessage,
        payload: {
          ...state.individualMessage,
          messages: [
            ...(state.individualMessage?.messages as Message[]),
            {
              content: messageText,
              role: MessageRole.User,
              timestamp: new Date().toISOString(),
            },
          ],
        } as Chat,
      });

      const response = await retryApiCall(
        () =>
          api.post(APIS.sendIndividualMessage(id), {
            message: messageText,
          }),
        3, // maxRetries
        1000, // baseDelay in ms
      );

      if (response.status !== HttpStatusCode.Ok) {
        throw new Error("Failed to send message");
      }

      console.info(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      await fetchIndividualChatList();
      dispatch({
        type: ChatAction.SetWaitingForResponse,
        payload: false,
      });
    }
  }, [
    dispatch,
    fetchIndividualChatList,
    id,
    messageText,
    state.individualMessage,
  ]);

  return (
    <View className={"flex flex-col gap-3.5"}>
      <View className={"mb-4 px-4"}>
        <View className="mb-4 flex-row items-center rounded-full border border-blue-secondary bg-white p-1 dark:bg-dark-senary">
          <TextInput
            className="min-h-12 flex-1 px-3 py-4 font-inter text-base text-black dark:text-white"
            placeholder="Message"
            placeholderTextColor="#919191"
            value={messageText}
            onChangeText={setMessageText}
            multiline
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
            className={
              "flex items-center justify-center rounded-full bg-blue p-3 disabled:bg-blue/60"
            }
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
