import { FunctionComponent } from "react";
import { View, Text } from "react-native";
import className from "classnames";
import { Message } from "@/app/data/message-list";
import { TypingIndicator } from "@/app/components/chat/chat-detail/TypingIndicator";

type Props = {
  message: Message;
};

export const UserMessage: FunctionComponent<Props> = ({
  message: { isUserMessage, text, loading },
}) => {
  return (
    <View
      className={className(
        "flex w-fit max-w-[80%] flex-col gap-1 rounded-3xl px-3 py-2",
        isUserMessage
          ? "self-end rounded-br-none bg-blue"
          : "self-start rounded-bl-none bg-light-quaternary dark:bg-dark-secondary",
      )}
    >
      {loading ? (
        <TypingIndicator />
      ) : (
        <View>
          <Text
            className={className(
              "font-sfPro text-base font-medium",
              isUserMessage ? "text-white" : "text-black dark:text-white",
            )}
          >
            {text}
          </Text>
          <Text
            className={className(
              "font-sfPro self-end text-xxxs font-medium",
              isUserMessage ? "text-white" : "text-black dark:text-white",
            )}
          >
            9:55 pm
          </Text>
        </View>
      )}
    </View>
  );
};
