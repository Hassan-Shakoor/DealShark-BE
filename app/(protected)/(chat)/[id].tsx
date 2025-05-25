import { ChatBackground } from "@/app/components/theme/ChatBackground";
import { CustomSafeArea } from "@/app/components/ui/CustomSafeArea";
import { ChatDetailHeader } from "@/app/components/chat/chat-detail/ChatDetailHeader";
import { MessageList } from "@/app/components/chat/chat-detail/MessageList";
import { KeyboardSection } from "@/app/components/chat/chat-detail/KeyboardSection";

const ChatView = () => {
  return (
    <ChatBackground>
      <CustomSafeArea classNames={"flex flex-col gap-3.5"}>
        <ChatDetailHeader />
        <MessageList />
        <KeyboardSection />
      </CustomSafeArea>
    </ChatBackground>
  );
};

export default ChatView;
