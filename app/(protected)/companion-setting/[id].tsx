import { CompanionBackground } from "@/app/components/theme/CompanionBackground";
import { CustomSafeArea } from "@/app/components/ui/CustomSafeArea";
import { CompanionSettingHeader } from "@/app/components/companion-setting/CompanionSettingHeader";
import {
  ScrollView,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ImageSection } from "@/app/components/companion-setting/ImageSection";
import { ChipSelector } from "@/app/components/companion-setting/ChipSelector";
import { FlirtingStyles, Personalities } from "@/app/data/companion-setting";
import { Button } from "@/app/components/ui/Button";
import { CompanionInfo } from "@/app/components/companion-setting/CompanionInfo";
import { api } from "@/app/utils/api";
import { APIS, ROUTES } from "@/app/utils/routes";
import { HttpStatusCode } from "axios";
import { useCallback, useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { CompanionSetting as CompanionSettingType } from "@/app/types/Chat";
import { useChatContext } from "@/app/contexts/useChatContext";
import { ChatAction } from "@/app/contexts/action";
import { handleError } from "@/app/utils/error-handling";
import Loader from "@/app/components/ui/Loader";
import Toast from "react-native-toast-message";

const CompanionSetting = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const param = useLocalSearchParams();
  const id: string = Array.isArray(param.id) ? param.id[0] : param.id;
  const { state, dispatch } = useChatContext();

  const fetchCompanionSetting = useCallback(async () => {
    try {
      if (!id) return;

      const response = await api.get<CompanionSettingType>(
        APIS.fetchCompanionSetting(id),
      );

      if (response.status !== HttpStatusCode.Ok) {
        throw new Error(`Error fetching companion setting`);
      }

      console.info(response.data);
      dispatch({
        type: ChatAction.SetCompanionSetting,
        payload: response.data,
      });
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, id]);

  const handlePersonalityPress = useCallback(
    (item: string) => {
      const currentPersonalities = state.companionSetting?.personality || [];
      let updatedPersonalities: string[];

      // Check if item is already selected
      const isSelected = currentPersonalities.some(
        (p) => p.toUpperCase() === item.toUpperCase(),
      );

      if (isSelected) {
        // Remove item if already selected
        updatedPersonalities = currentPersonalities.filter(
          (p) => p.toUpperCase() !== item.toUpperCase(),
        );
      } else {
        // Add item if not selected, but ensure max 2 items
        if (currentPersonalities.length < 2) {
          updatedPersonalities = [...currentPersonalities, item];
        } else {
          // Remove oldest item (first in array) and add new one
          updatedPersonalities = [...currentPersonalities.slice(1), item];
        }
      }

      dispatch({
        type: ChatAction.SetCompanionSetting,
        payload: {
          ...state.companionSetting,
          personality: updatedPersonalities,
        } as CompanionSettingType,
      });
    },
    [dispatch, state.companionSetting],
  );

  const handleFlirtStylePress = useCallback(
    (item: string) => {
      const currentStyles = state.companionSetting?.flirting_style || [];

      // Check if item is already selected
      const isSelected = currentStyles.some(
        (s) => s.toUpperCase() === item.toUpperCase(),
      );

      // If already selected, deselect it (empty array)
      // If not selected, make it the only selected item
      const updatedStyles = isSelected ? [] : [item];

      dispatch({
        type: ChatAction.SetCompanionSetting,
        payload: {
          ...state.companionSetting,
          flirting_style: updatedStyles,
        } as CompanionSettingType,
      });
    },
    [dispatch, state.companionSetting],
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, []);

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
      router.replace(ROUTES.ChatView(id));
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, id, state.companionSetting]);

  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  useEffect(() => {
    fetchCompanionSetting();
  }, [fetchCompanionSetting]);

  return (
    <CompanionBackground>
      <CustomSafeArea classNames={"flex flex-col gap-2"}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={{ flex: 1 }}>
              <CompanionSettingHeader />
              <View className={"mt-5 flex flex-1 gap-5 px-6"}>
                <ImageSection />
                <CompanionInfo />
                <ScrollView showsVerticalScrollIndicator={false}>
                  <ChipSelector
                    title={"Personality"}
                    data={Personalities}
                    selectedItems={state.companionSetting?.personality ?? []}
                    handlePress={handlePersonalityPress}
                  />
                  <ChipSelector
                    title={"Flirting Style"}
                    data={FlirtingStyles}
                    selectedItems={state.companionSetting?.flirting_style ?? []}
                    handlePress={handleFlirtStylePress}
                    className={"pt-3"}
                  />
                </ScrollView>
              </View>
              <View className={"mb-6 flex flex-row gap-2 px-6"}>
                <View className={"flex-1"}>
                  <Button onPress={handleSave} disabled={isLoading}>
                    <Text className={"font-sfPro text-white"}>
                      {isLoading ? <Loader size={"small"} /> : "Save"}
                    </Text>
                  </Button>
                </View>
                <View className={"flex-1"}>
                  <Button onPress={handleCancel} variant={"secondary"}>
                    <Text className={"font-sfPro text-white"}>Cancel</Text>
                  </Button>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </CustomSafeArea>
    </CompanionBackground>
  );
};

export default CompanionSetting;
