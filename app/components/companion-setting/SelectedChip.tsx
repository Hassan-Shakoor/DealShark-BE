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
      className="relative flex flex-col items-center justify-center"
      activeOpacity={0.7}
      onPress={onPress}
    >
      {/* Gradient border layer */}
      <LinearGradient
        colors={["#CD85C7", "#B6DAFE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="absolute inset-0"
        style={{ borderRadius: 14 }}
      />

      {/* Content layer */}
      <View className="mx-1 rounded-xl bg-tertiary p-3">
        <Text className={"font-sfPro text-lg text-white"}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
