import { FunctionComponent } from "react";
import { Text, TouchableOpacity } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
};

export const UnSelectedChip: FunctionComponent<Props> = ({
  title,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className={
        "rounded-xl border-[4px] border-transparent bg-quinary p-3 dark:bg-quaternary"
      }
    >
      <Text className={"font-sfPro text-lg text-white dark:text-subtle"}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
