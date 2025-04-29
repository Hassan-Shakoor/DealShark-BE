import { CompanionBackground } from "@/app/components/theme/CompanionBackground";
import { CustomSafeArea } from "@/app/components/ui/CustomSafeArea";
import { CompanionSettingHeader } from "@/app/components/companion-setting/CompanionSettingHeader";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { ImageSection } from "@/app/components/companion-setting/ImageSection";
import { ChipSelector } from "@/app/components/companion-setting/ChipSelector";
import { FlirtingStyles, Personalities } from "@/app/data/companion-setting";
import { Button } from "@/app/components/ui/Button";
import { CompanionInfo } from "@/app/components/companion-setting/CompanionInfo";

const CompanionSetting = () => {
  return (
    <CompanionBackground>
      <CustomSafeArea classNames={"flex flex-col gap-2"}>
        <CompanionSettingHeader />
        <View className={"mt-5 flex flex-1 gap-5 px-6"}>
          <ImageSection />
          <CompanionInfo />
          <ChipSelector title={"Personality"} data={Personalities} />
          <ChipSelector title={"Flirting Style"} data={FlirtingStyles} />
        </View>
        <View className={"mb-6 flex flex-row gap-2 px-6"}>
          <View className={"flex-1"}>
            <Button>
              <Text className={"text-white"}>Save</Text>
            </Button>
          </View>
          <View className={"flex-1"}>
            <Button variant={"secondary"}>
              <Text className={"text-white"}>Cancel</Text>
            </Button>
          </View>
        </View>
      </CustomSafeArea>
    </CompanionBackground>
  );
};

export default CompanionSetting;
