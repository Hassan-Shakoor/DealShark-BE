import React from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomCheckboxProps {
  checked: boolean;
  onPress: () => void;
  size?: number;
  checkedColor?: string;
  uncheckedColor?: string;
  borderColor?: string;
  style?: ViewStyle;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onPress,
  size = 24,
  checkedColor = "#007AFF", // iOS blue
  uncheckedColor = "transparent",
  borderColor = "#C7C7CC", // iOS border color
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          width: size,
          height: size,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: checked ? checkedColor : borderColor,
          backgroundColor: checked ? checkedColor : uncheckedColor,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
      activeOpacity={0.7}
    >
      {checked && <Ionicons name="checkmark" size={size * 0.7} color="white" />}
    </TouchableOpacity>
  );
};
