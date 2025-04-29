import { FunctionComponent, useCallback, useState } from "react";
import { Text, View } from "react-native";
import { UnSelectedChip } from "@/app/components/companion-setting/UnSelectedChip";
import { SelectedChip } from "@/app/components/companion-setting/SelectedChip";

type Props = {
  title: string;
  data: string[];
};

export const ChipSelector: FunctionComponent<Props> = ({ title, data }) => {
  const [isSelected, setSelected] = useState<string>("");

  const handlePress = useCallback((item: string) => {
    setSelected(item);
  }, []);

  return (
    <View className={"flex flex-col gap-3"}>
      <Text className={"font-brockmann font-medium text-black dark:text-white"}>
        {title}
      </Text>
      <View className={"flex flex-row flex-wrap gap-1"}>
        {data.map((item, index) =>
          isSelected === item ? (
            <SelectedChip
              key={`${item}-${index}`}
              title={item}
              onPress={() => handlePress(item)}
            />
          ) : (
            <UnSelectedChip
              key={`${item}-${index}`}
              title={item}
              onPress={() => handlePress(item)}
            />
          ),
        )}
      </View>
    </View>
  );
};
