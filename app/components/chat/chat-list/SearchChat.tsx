import { FunctionComponent, useCallback, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { TextInput, View, Platform } from "react-native";
import { useChatContext } from "@/app/contexts/useChatContext";
import { ChatAction } from "@/app/contexts/action";

export const SearchChat: FunctionComponent = () => {
  const { state, dispatch } = useChatContext();
  const searchInputRef = useRef<TextInput>(null);

  const handleSearchChange = useCallback(
    (text: string) => {
      dispatch({ type: ChatAction.SetChatSearchQuery, payload: text });
    },
    [dispatch],
  );

  const handleInputFocus = useCallback(() => {
    if (Platform.OS === "web" && searchInputRef.current) {
      // Force keyboard to appear on iOS PWA
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  }, []);

  return (
    <View className="flex-row items-center rounded-lg bg-light-secondary px-3 py-3 dark:bg-dark-tertiary/20">
      <Feather name="search" size={18} color="#3C3C4399" />
      <TextInput
        ref={searchInputRef}
        placeholder="Search"
        placeholderTextColor="#3C3C4399"
        className="ml-2 flex-1 text-white"
        value={state.chatSearchQuery}
        onChangeText={handleSearchChange}
        onFocus={handleInputFocus}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        style={{
          userSelect: "text",
        }}
      />
    </View>
  );
};
