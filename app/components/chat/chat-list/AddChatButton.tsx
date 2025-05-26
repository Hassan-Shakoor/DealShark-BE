import { FunctionComponent, useCallback, useState } from "react";
import { Button } from "@/app/components/ui/Button";
import Entypo from "@expo/vector-icons/Entypo";
import { View } from "react-native";
import { handleError } from "@/app/utils/error-handling";
import { api } from "@/app/utils/api";
import { APIS } from "@/app/utils/routes";
import { HttpStatusCode } from "axios";
import { useChatContext } from "@/app/contexts/useChatContext";
import { Chat } from "@/app/types/Chat";
import { ChatAction } from "@/app/contexts/action";

export const AddChatButton: FunctionComponent = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { dispatch } = useChatContext();

  const fetchChatList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<{ chats: Chat[] }>(APIS.fetchAllChats);

      if (response.status !== HttpStatusCode.Ok) {
        throw new Error(`Failed to fetch chat list`);
      }

      dispatch({ type: ChatAction.SetChatList, payload: response.data.chats });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const handleAddButton = useCallback(async () => {
    try {
      const response = await api.post(APIS.createNewChat, {
        message: " What name did i give you?",
      });

      if (response.status !== HttpStatusCode.Created) {
        throw new Error(`Failed to create new chat`);
      }

      console.info(response.data);
      await fetchChatList();
    } catch (error) {
      handleError(error);
    }
  }, [fetchChatList]);

  return (
    <View className={"absolute bottom-4 right-4.5 z-10"}>
      <Button
        disabled={isLoading}
        onPress={handleAddButton}
        classNames={"!p-3 !rounded-full items-center justify-center"}
      >
        <Entypo name="plus" size={45} color={"white"} />
      </Button>
    </View>
  );
};
