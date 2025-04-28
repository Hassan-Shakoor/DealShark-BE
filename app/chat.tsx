import { ChatBackground } from "@/app/components/theme/ChatBackground";
import { CustomSafeArea } from "@/app/components/ui/CustomSafeArea";
import { ChatHeader } from "@/app/components/chat/ChatHeader";
import { SearchChat } from "@/app/components/chat/SearchChat";
import { ChatFavoriteList } from "@/app/components/chat/ChatFavoriteList";
import { ChatList } from "@/app/components/chat/ChatList";
import { AddChatButton } from "@/app/components/chat/AddChatButton";

const Chat = () => {
  return (
    <ChatBackground>
      <CustomSafeArea classNames={"px-5"}>
        <ChatHeader />
        <SearchChat />
        <ChatFavoriteList />
        <ChatList />
        <AddChatButton />
      </CustomSafeArea>
    </ChatBackground>
  );
};

export default Chat;
