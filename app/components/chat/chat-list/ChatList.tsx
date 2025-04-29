import { FlatList } from "react-native";
import { ChatMessage } from "@/app/components/chat/chat-list/ChatMessage";
import { FavoriteChatList } from "@/app/data/chat-list";

export const ChatList = () => {
  return (
    <FlatList
      scrollEnabled
      showsVerticalScrollIndicator={false}
      data={FavoriteChatList}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChatMessage item={item} />}
      contentContainerClassName={"gap-1"}
    />
  );
};
