import { FunctionComponent } from "react";
import { Button } from "@/app/components/ui/Button";
import Entypo from "@expo/vector-icons/Entypo";
import { View } from "react-native";

export const AddChatButton: FunctionComponent = () => {
  return (
    <View className={"absolute bottom-4 right-4.5 z-10"}>
      <Button classNames={"!p-3 !rounded-full items-center justify-center"}>
        <Entypo name="plus" size={45} color={"white"} />
      </Button>
    </View>
  );
};
