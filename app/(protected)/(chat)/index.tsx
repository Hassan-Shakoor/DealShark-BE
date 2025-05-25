import { ChatBackground } from "@/app/components/theme/ChatBackground";
import { CustomSafeArea } from "@/app/components/ui/CustomSafeArea";
import { ChatHeader } from "@/app/components/chat/chat-list/ChatHeader";
import { SearchChat } from "@/app/components/chat/chat-list/SearchChat";
import { ChatFavoriteList } from "@/app/components/chat/chat-list/ChatFavoriteList";
import { ChatList } from "@/app/components/chat/chat-list/ChatList";
import { AddChatButton } from "@/app/components/chat/chat-list/AddChatButton";

const Index = () => {
  return (
    <ChatBackground>
      <CustomSafeArea classNames={"px-5 relative flex-1 mb-4"}>
        <ChatHeader />
        <SearchChat />
        <ChatFavoriteList />
        <ChatList />
        <AddChatButton />
      </CustomSafeArea>
    </ChatBackground>
  );
};

export default Index;
