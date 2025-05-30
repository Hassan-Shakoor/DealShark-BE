import { FunctionComponent, useCallback, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useChatContext } from "@/app/contexts/useChatContext";
import { ChatAction } from "@/app/contexts/action";
import { CompanionSetting } from "@/app/types/Chat";

export const ImageSection: FunctionComponent = () => {
  const { state, dispatch } = useChatContext();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleEditing = useCallback(() => {
    setIsEditing((prev) => !prev);
  }, [setIsEditing]);

  const handleNameChange = useCallback(
    (text: string) => {
      dispatch({
        type: ChatAction.SetCompanionSetting,
        payload: { ...state.companionSetting, name: text } as CompanionSetting,
      });
    },
    [dispatch, state.companionSetting],
  );

  return (
    <View className={"flex flex-col items-center gap-2"}>
      <Image
        source={
          state.companionSetting?.gender === "female"
            ? require("@/assets/images/female-avatar.png")
            : require("@/assets/images/male-avatar.png")
        }
        className={"size-20 self-center rounded-full"}
      />
      <View className={"flex flex-row items-center gap-3"}>
        {isEditing ? (
          <TextInput
            value={state.companionSetting?.name}
            onChangeText={handleNameChange}
            autoFocus
            className={
              "border-b border-gray-400 font-inter text-2xl font-medium text-black dark:text-white"
            }
            style={{ minWidth: 100 }} // to give some width
          />
        ) : (
          <Text
            className={
              "font-inter text-2xl font-medium text-black dark:text-white"
            }
          >
            {state.companionSetting?.name}
          </Text>
        )}
        <TouchableOpacity activeOpacity={0.7} onPress={toggleEditing}>
          <Image
            source={require("@/assets/images/cross-icon.png")}
            className={"size-6"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
