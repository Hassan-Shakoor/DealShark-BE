import { FunctionComponent } from "react";
import { Feather } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

export const SearchChat: FunctionComponent = () => {
  return (
    <View className="flex-row items-center rounded-lg bg-light-secondary px-3 py-2 dark:bg-dark-tertiary/20">
      <Feather name="search" size={18} color="#3C3C4399" />
      <TextInput
        placeholder="Search"
        placeholderTextColor="#3C3C4399"
        className="ml-2 flex-1 text-white"
      />
    </View>
  );
};
