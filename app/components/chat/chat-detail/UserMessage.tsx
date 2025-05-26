import { FunctionComponent } from "react";
import { View, Text } from "react-native";
import className from "classnames";
import { Message, MessageRole } from "@/app/types/Chat";
import { TypingIndicator } from "@/app/components/chat/chat-detail/TypingIndicator";

type Props = {
  message: Message;
};

export const UserMessage: FunctionComponent<Props> = ({
  message: { content, role, timestamp },
}) => {
  return (
    <View
      className={className(
        "flex w-fit max-w-[80%] flex-col gap-1 rounded-3xl px-3 py-2",
        role === MessageRole.User
          ? "self-end rounded-br-none bg-blue"
          : "self-start rounded-bl-none bg-light-quaternary dark:bg-dark-secondary",
      )}
    >
      {content === "loading" ? (
        <TypingIndicator />
      ) : (
        <View>
          <Text
            className={className(
              "font-sfPro text-base font-medium",
              role === MessageRole.User
                ? "text-white"
                : "text-black dark:text-white",
            )}
          >
            {content}
          </Text>
          <Text
            className={className(
              "self-end font-sfPro text-xxxs font-medium",
              role === MessageRole.User
                ? "text-white"
                : "text-black dark:text-white",
            )}
          >
            {`${new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}`}
          </Text>
        </View>
      )}
    </View>
  );
};
