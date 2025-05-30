import { FunctionComponent, useCallback, useMemo, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useLocalSearchParams } from "expo-router";
import { APIS, ROUTES } from "@/app/utils/routes";
import { useChatContext } from "@/app/contexts/useChatContext";
import { api } from "@/app/utils/api";
import { handleError } from "@/app/utils/error-handling";
import { HttpStatusCode } from "axios";
import { ChatAction } from "@/app/contexts/action";
import Loader from "@/app/components/ui/Loader";

export const ChatDetailHeader: FunctionComponent = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const param = useLocalSearchParams();
  const id: string = Array.isArray(param.id) ? param.id[0] : param.id;

  const { state, dispatch } = useChatContext();

  const isMessagePinned = useMemo(() => {
    const pinnedMessage = state.pinnedChats.find(
      (message) => String(message.chat_id) === id,
    );

    return !!pinnedMessage;
  }, [id, state.pinnedChats]);

  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  const handleProfilePress = useCallback(() => {
    router.push(ROUTES.CompanionSetting(id));
  }, [id]);

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

  const handlePinPress = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.post(
        isMessagePinned ? APIS.unPinChat(id) : APIS.pinChat(id),
      );

      if (response.status !== HttpStatusCode.Ok) {
        throw new Error(`Failed to ${isMessagePinned ? "unpin" : "pin"} chat`);
      }

      console.info(response.data);
      await fetchFavoriteChatList();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [fetchFavoriteChatList, id, isMessagePinned]);

  return (
    <View
      className={
        "flex w-full flex-row items-center justify-between bg-light-tertiary p-2 pt-4 dark:bg-dark-quinary"
      }
    >
      <View>
        <TouchableOpacity onPress={handleBackPress} activeOpacity={0.7}>
          <AntDesign name="left" size={24} color="#545454" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={handleProfilePress}
        className={"flex-col gap-1"}
      >
        <Image
          source={require("@/assets/images/chat-header-icon.png")}
          className={"size-12.5 self-center rounded-full"}
        />
        <Text
          className={
            "text-center font-sfPro text-sm text-black dark:text-white"
          }
        >
          {state.individualMessage?.companion_name}
        </Text>
      </TouchableOpacity>
      <View>
        {isLoading ? (
          <View className={"size-7"}>
            <Loader size={"small"} />
          </View>
        ) : (
          <TouchableOpacity onPress={handlePinPress} activeOpacity={0.7}>
            <AntDesign
              name={isMessagePinned ? "pushpin" : "pushpino"}
              size={24}
              color="#545454"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
