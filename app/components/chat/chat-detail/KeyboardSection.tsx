import { FunctionComponent, useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ROUTES } from "@/app/utils/routes";

export const KeyboardSection: FunctionComponent = () => {
  const [messageText, setMessageText] = useState<string>("");

  const handleSendMessage = useCallback(() => {
    console.log("Message sent:", messageText);
    setMessageText("");
  }, [messageText]);

  const handleTextPress = useCallback(() => {
    router.push(ROUTES.Purchase);
  }, []);

  return (
    <View className={"flex flex-col gap-3.5"}>
      <Text
        onPress={handleTextPress}
        className={"font-sfPro text-center text-xs font-medium text-appleGrey"}
      >
        Free trial: 2 Messages left
      </Text>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
        className="mb-4 px-4"
      >
        <View className="flex-row items-center rounded-full border border-blue-secondary bg-white p-1 dark:bg-dark-senary">
          <TextInput
            className="min-h-12 flex-1 px-3 py-4 font-inter text-base text-black dark:text-white"
            placeholder="Message"
            placeholderTextColor="#919191"
            value={messageText}
            onChangeText={setMessageText}
            multiline
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
            className={
              "flex items-center justify-center rounded-full bg-blue p-3 disabled:bg-blue/60"
            }
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
