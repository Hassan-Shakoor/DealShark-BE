import { ChatBackground } from "@/app/components/theme/ChatBackground";
import { ScrollView, Text, View } from "react-native";
import { Button } from "@/app/components/ui/Button";
import { useCallback, useState } from "react";
import { Checkbox } from "react-native-paper";
import { router } from "expo-router";
import { ROUTES } from "@/app/utils/routes";
import { CustomSafeArea } from "@/app/components/ui/CustomSafeArea";

const TermsAndCondition = () => {
  const [isChecked, setChecked] = useState<boolean>(false);

  const handleCheck = useCallback(() => {
    setChecked((prev) => !prev);
  }, []);

  const handleContinue = useCallback(() => {
    router.push(ROUTES.Chat);
  }, []);

  return (
    <ChatBackground>
      <CustomSafeArea>
        <View className={"flex flex-1 flex-col justify-between p-10"}>
          <View className={"flex flex-col gap-3"}>
            <Text
              className={
                "font-sfPro pt-12 text-3xl font-medium text-black dark:text-white"
              }
            >
              Terms and Conditions
            </Text>
            <ScrollView>
              <Text className={"font-sfPro text-lg text-black dark:text-white"}>
                This Site and all its Contents are intended solely for personal,
                non-commercial use. Except as expressly provided, nothing within
                the Site shall be construed as conferring any license under our
                or any third party's intellectual property rights, whether by
                estoppel, implication, waiver, or otherwise. Without limiting
                the generality of the foregoing, you acknowledge and agree that
                all content available through and used to operate the Site and
                its services is protected by copyright, trademark, patent, or
                other proprietary rights Without limiting the generality of the
                foregoing, you acknowledge and agree that all content Without
                limiting the generality of the foregoing, you acknowledge and
                agree that all content
              </Text>
            </ScrollView>
          </View>
          <View className={"flex flex-col gap-5"}>
            <View className={"flex flex-row items-center gap-2"}>
              <Checkbox
                status={isChecked ? "checked" : "unchecked"} // Checkbox status based on state
                onPress={handleCheck} // Toggle checkbox state on press
              />
              <Text className={"font-sfPro text-lg text-black dark:text-white"}>
                I accept the <Text>Terms and Agreement</Text>
              </Text>
            </View>
            <Button disabled={!isChecked} onPress={handleContinue}>
              <Text className={"font-sfPro text-white"}>Continue</Text>
            </Button>
          </View>
        </View>
      </CustomSafeArea>
    </ChatBackground>
  );
};

export default TermsAndCondition;
