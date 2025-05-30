import { FunctionComponent } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
};

export const SelectedChip: FunctionComponent<Props> = ({ title, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <LinearGradient
        colors={["#CD85C7", "#B6DAFE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ borderRadius: 14, padding: 4 }}
      >
        <View className="rounded-xl bg-tertiary p-3">
          <Text className={"font-sfPro text-lg text-white"}>{title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};
