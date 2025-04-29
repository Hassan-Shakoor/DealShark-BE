import { Text, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Theme } from "@/app/utils/constant";
import { FunctionComponent } from "react";
import { useColorScheme } from "nativewind";

export const CompanionInfo: FunctionComponent = () => {
  const { colorScheme } = useColorScheme();

  return (
    <View className={"mt-2 flex flex-col gap-1"}>
      <TouchableOpacity
        activeOpacity={0.7}
        className={
          "flex flex-row items-center justify-between rounded-xl bg-white/50 px-4.5 py-5.5 dark:bg-dark-septenary/50"
        }
      >
        <Text
          className={"font-apfelGrotezk text-lg text-black dark:text-white"}
        >
          Change Avatar
        </Text>
        <AntDesign
          name="right"
          size={14}
          color={colorScheme === Theme.Dark ? "#CDC3C3" : "#000000"}
        />
      </TouchableOpacity>
      <View
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
          className={"font-apfelGrotezk text-sm text-black dark:text-white"}
        >
          Female
        </Text>
      </View>
    </View>
  );
};
