import { ChatBackground } from "@/app/components/theme/ChatBackground";
import { CustomSafeArea } from "@/app/components/ui/CustomSafeArea";
import { ChatDetailHeader } from "@/app/components/chat/chat-detail/ChatDetailHeader";
import { MessageList } from "@/app/components/chat/chat-detail/MessageList";
import { KeyboardSection } from "@/app/components/chat/chat-detail/KeyboardSection";
import { KeyboardAvoidingView, Platform } from "react-native";

const ChatView = () => {
  return (
    <ChatBackground>
      <CustomSafeArea classNames={"flex flex-col"}>
        <ChatDetailHeader />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <MessageList />
          <KeyboardSection />
        </KeyboardAvoidingView>
      </CustomSafeArea>
    </ChatBackground>
  );
};

export default ChatView;
