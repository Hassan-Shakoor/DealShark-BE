import { FunctionComponent, useCallback } from "react";
import { Feather } from "@expo/vector-icons";
import { TextInput, View } from "react-native";
import { useChatContext } from "@/app/contexts/useChatContext";
import { ChatAction } from "@/app/contexts/action";

export const SearchChat: FunctionComponent = () => {
  const { state, dispatch } = useChatContext();

  const handleSearchChange = useCallback(
    (text: string) => {
      dispatch({ type: ChatAction.SetChatSearchQuery, payload: text });
    },
    [dispatch],
  );

  return (
    <View className="flex-row items-center rounded-lg bg-light-secondary px-3 py-2 dark:bg-dark-tertiary/20">
      <Feather name="search" size={18} color="#3C3C4399" />
      <TextInput
        placeholder="Search"
        placeholderTextColor="#3C3C4399"
        className="ml-2 flex-1 text-white"
        value={state.chatSearchQuery}
        onChangeText={handleSearchChange}
      />
    </View>
  );
};
