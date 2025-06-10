import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FunctionComponent, useCallback, useState } from "react";
import { useChatContext } from "@/app/contexts/useChatContext";
import { ChatAction } from "@/app/contexts/action";
import {
  CompanionSetting as CompanionSettingType,
  CompanionSetting,
} from "@/app/types/Chat";
import { SelectedChip } from "@/app/components/companion-setting/SelectedChip";
import { UnSelectedChip } from "@/app/components/companion-setting/UnSelectedChip";
import { Button } from "@/app/components/ui/Button";
import Loader from "@/app/components/ui/Loader";
import { api } from "@/app/utils/api";
import { APIS } from "@/app/utils/routes";
import { HttpStatusCode } from "axios";
import { useLocalSearchParams } from "expo-router";
import { handleError } from "@/app/utils/error-handling";
import Toast from "react-native-toast-message";

export const CompanionInfo: FunctionComponent = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { state, dispatch } = useChatContext();

  const param = useLocalSearchParams();
  const id: string = Array.isArray(param.id) ? param.id[0] : param.id;

  const handleGender = useCallback(
    (gender: string) => {
      dispatch({
        type: ChatAction.SetCompanionSetting,
        payload: {
          ...state.companionSetting,
          gender,
        } as CompanionSetting,
      });
    },
    [dispatch, state.companionSetting],
  );

  const handleSave = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.put<CompanionSettingType>(
        APIS.updateCompanionSetting,
        {
          chat_id: id,
          ...state.companionSetting,
        },
      );

      if (response.status !== HttpStatusCode.Ok) {
        throw new Error("Error updating companion setting");
      }

      console.info(response.data);
      dispatch({
        type: ChatAction.SetCompanionSetting,
        payload: response.data,
      });

      Toast.show({
        type: "success",
        text1: "Companion setting updated successfully!",
      });
    } catch (error) {
      handleError(error);
    } finally {
      setModalVisible(false);
      setLoading(false);
    }
  }, [dispatch, id, state.companionSetting]);

  return (
    <View className={"mt-2 flex flex-col gap-1"}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
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
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          className={
            "flex flex-1 flex-col items-center justify-center bg-white/70 dark:bg-black/40"
          }
        >
          <View
            className={
              "bg-light-quinary dark:bg-senary flex w-3/4 flex-col gap-10 rounded-2xl px-5 py-5"
            }
          >
            <Text
              className={
                "text-center font-sfPro text-xl font-medium text-black dark:text-white"
              }
            >
              Select Gender
            </Text>
            <View className={"flex flex-col gap-1.5"}>
              {state.companionSetting?.gender === "male" ? (
                <SelectedChip
                  title={"Male"}
                  onPress={() => handleGender("male")}
                />
              ) : (
                <UnSelectedChip
                  title={"Male"}
                  onPress={() => handleGender("male")}
                />
              )}
              {state.companionSetting?.gender === "female" ? (
                <SelectedChip
                  title={"Female"}
                  onPress={() => handleGender("female")}
                />
              ) : (
                <UnSelectedChip
                  title={"Female"}
                  onPress={() => handleGender("female")}
                />
              )}
              <Text
                className={
                  "text-center font-sfPro text-sm text-black dark:text-white"
                }
              >
                Other (kindly specify below)
              </Text>
              <TextInput
                value={
                  state.companionSetting?.gender === "male" ||
                  state.companionSetting?.gender === "female"
                    ? ""
                    : state.companionSetting?.gender
                }
                onChangeText={handleGender}
                autoFocus
                placeholder={"Custom Gender"}
                className={
                  "rounded-xl border-[4px] border-transparent bg-quinary p-3 font-inter text-2xl font-medium text-black placeholder:text-lg placeholder:text-subtle dark:bg-quaternary dark:text-white"
                }
              />
            </View>
            <View className={"flex flex-row gap-2"}>
              <View className={"flex-1"}>
                <Button onPress={handleSave} disabled={isLoading}>
                  <Text className={"font-sfPro text-white"}>
                    {isLoading ? <Loader size={"small"} /> : "Save"}
                  </Text>
                </Button>
              </View>
              <View className={"flex-1"}>
                <Button
                  onPress={() => setModalVisible(false)}
                  variant={"secondary"}
                >
                  <Text className={"font-sfPro text-white"}>Cancel</Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
