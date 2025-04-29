import { FunctionComponent } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
};

export const SelectedChip: FunctionComponent<Props> = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      className="relative rounded-3xl"
      activeOpacity={0.7}
      onPress={onPress}
    >
      {/* Gradient border layer */}
      <LinearGradient
        colors={["#CD85C7", "#B6DAFE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="absolute inset-0"
        style={{ borderRadius: 12 }}
      />

      {/* Content layer */}
      <View className="m-1 rounded-xl bg-tertiary p-3">
        <Text
          className={"font-apfelGrotezk text-lg text-white dark:text-subtle"}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
