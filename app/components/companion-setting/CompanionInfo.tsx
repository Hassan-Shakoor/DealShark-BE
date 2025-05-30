import { Text, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Theme } from "@/app/utils/constant";
import { FunctionComponent, useCallback } from "react";
import { useColorScheme } from "nativewind";
import { useChatContext } from "@/app/contexts/useChatContext";
import { ChatAction } from "@/app/contexts/action";
import { CompanionSetting } from "@/app/types/Chat";

export const CompanionInfo: FunctionComponent = () => {
  const { colorScheme } = useColorScheme();
  const { state, dispatch } = useChatContext();

  const handleToggleGender = useCallback(() => {
    dispatch({
      type: ChatAction.SetCompanionSetting,
      payload: {
        ...state.companionSetting,
        gender: state.companionSetting?.gender === "female" ? "male" : "female",
      } as CompanionSetting,
    });
  }, [dispatch, state.companionSetting]);

  return (
    <View className={"mt-2 flex flex-col gap-1"}>
      {/*<TouchableOpacity*/}
      {/*  activeOpacity={0.7}*/}
      {/*  className={*/}
      {/*    "flex flex-row items-center justify-between rounded-xl bg-white/50 px-4.5 py-5.5 dark:bg-dark-septenary/50"*/}
      {/*  }*/}
      {/*>*/}
      {/*  <Text*/}
      {/*    className={"font-apfelGrotezk text-lg text-black dark:text-white"}*/}
      {/*  >*/}
      {/*    Change Avatar*/}
      {/*  </Text>*/}
      {/*  <AntDesign*/}
      {/*    name="right"*/}
      {/*    size={14}*/}
      {/*    color={colorScheme === Theme.Dark ? "#CDC3C3" : "#000000"}*/}
      {/*  />*/}
      {/*</TouchableOpacity>*/}
      <TouchableOpacity
        onPress={handleToggleGender}
        activeOpacity={0.7}
        className={
          "flex flex-row items-center justify-between rounded-xl bg-white/50 px-4.5 py-5.5 dark:bg-dark-septenary/50"
        }
      >
        <Text
          className={"font-apfelGrotezk text-lg text-black dark:text-white"}
        >
          Gender
        </Text>
        <Text
          className={
            "font-apfelGrotezk text-sm capitalize text-black dark:text-white"
          }
        >
          {state.companionSetting?.gender ?? "Loading..."}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
