import { FunctionComponent, useEffect, useMemo, useRef } from "react";
import { UserMessage } from "@/app/components/chat/chat-detail/UserMessage";
import { FlatList, View } from "react-native";
import { useChatContext } from "@/app/contexts/useChatContext";
import { Message, MessageRole } from "@/app/types/Chat";

export const MessageList: FunctionComponent = () => {
  // Create a ref for the FlatList component
  const flatListRef = useRef<FlatList<Message>>(null);
  const { state } = useChatContext();

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
