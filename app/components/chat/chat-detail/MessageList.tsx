import { FunctionComponent, useMemo, useRef, useEffect } from "react";
import { UserMessage } from "@/app/components/chat/chat-detail/UserMessage";
import { FlatList, View } from "react-native";
import { Message, Messages } from "@/app/data/message-list";

export const MessageList: FunctionComponent = () => {
  // Create a ref for the FlatList component
  const flatListRef = useRef<FlatList<Message>>(null);

  const messageWithLoader: Message[] = useMemo(
    () => [...Messages, { id: 999, loading: true }],
    [],
  );

  // Scroll to the end whenever messages change
  useEffect(() => {
    // Use a timeout to ensure the FlatList has rendered
    const timer = setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: false });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [messageWithLoader]);

  return (
    <View className={"flex-1 px-3.5"}>
      <FlatList
        ref={flatListRef}
        scrollEnabled
        showsVerticalScrollIndicator={false}
        data={messageWithLoader}
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
