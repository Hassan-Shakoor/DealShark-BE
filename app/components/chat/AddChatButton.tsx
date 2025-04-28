import { FunctionComponent } from "react";
import { Button } from "@/app/components/ui/Button";
import Entypo from "@expo/vector-icons/Entypo";
import { View } from "react-native";

export const AddChatButton: FunctionComponent = () => {
  return (
    <View className={"self-end"}>
      <Button
        classNames={"mb-12 mt-4 !p-3 !rounded-full items-center justify-center"}
      >
        <Entypo name="plus" size={45} color={"white"} />
      </Button>
    </View>
  );
};
