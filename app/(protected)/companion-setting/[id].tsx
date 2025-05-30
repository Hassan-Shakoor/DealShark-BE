import { CompanionBackground } from "@/app/components/theme/CompanionBackground";
import { CustomSafeArea } from "@/app/components/ui/CustomSafeArea";
import { CompanionSettingHeader } from "@/app/components/companion-setting/CompanionSettingHeader";
import { ScrollView, Text, View } from "react-native";
import { ImageSection } from "@/app/components/companion-setting/ImageSection";
import { ChipSelector } from "@/app/components/companion-setting/ChipSelector";
import { FlirtingStyles, Personalities } from "@/app/data/companion-setting";
import { Button } from "@/app/components/ui/Button";
import { CompanionInfo } from "@/app/components/companion-setting/CompanionInfo";
import { api } from "@/app/utils/api";
import { APIS } from "@/app/utils/routes";
import { HttpStatusCode } from "axios";
import { useCallback, useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { CompanionSetting as CompanionSettingType } from "@/app/types/Chat";
import { useChatContext } from "@/app/contexts/useChatContext";
import { ChatAction } from "@/app/contexts/action";
import { handleError } from "@/app/utils/error-handling";
import Loader from "@/app/components/ui/Loader";

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
        // Add item if not selected
        updatedPersonalities = [...currentPersonalities, item];
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
      let updatedStyles: string[];

      // Check if item is already selected
      const isSelected = currentStyles.some(
        (s) => s.toUpperCase() === item.toUpperCase(),
      );

      if (isSelected) {
        // Remove item if already selected
        updatedStyles = currentStyles.filter(
          (s) => s.toUpperCase() !== item.toUpperCase(),
        );
      } else {
        // Add item if not selected
        updatedStyles = [...currentStyles, item];
      }

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
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, id, state.companionSetting]);

  useEffect(() => {
    fetchCompanionSetting();
  }, [fetchCompanionSetting]);

  return (
    <CompanionBackground>
      <CustomSafeArea classNames={"flex flex-col gap-2"}>
        <CompanionSettingHeader />
        <View className={"mt-5 flex flex-1 gap-5 px-6"}>
          <ImageSection />
          <CompanionInfo />
          <ScrollView>
            <ChipSelector
              title={"Personality"}
              data={Personalities}
              selectedItems={state.companionSetting?.personality ?? []} // Changed prop name
              handlePress={handlePersonalityPress}
            />
            <ChipSelector
              title={"Flirting Style"}
              data={FlirtingStyles}
              selectedItems={state.companionSetting?.flirting_style ?? []} // Changed prop name
              handlePress={handleFlirtStylePress}
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
      </CustomSafeArea>
    </CompanionBackground>
  );
};

export default CompanionSetting;
