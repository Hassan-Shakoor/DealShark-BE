import { FunctionComponent, useCallback } from "react";
import { Text, View } from "react-native";
import { UnSelectedChip } from "@/app/components/companion-setting/UnSelectedChip";
import { SelectedChip } from "@/app/components/companion-setting/SelectedChip";

type Props = {
  selectedItems: string[];
  title: string;
  data: string[];
  handlePress: (item: string) => void;
};

export const ChipSelector: FunctionComponent<Props> = ({
  title,
  data,
  selectedItems,
  handlePress,
}) => {
  const isItemSelected = useCallback(
    (item: string) => {
      return selectedItems.some(
        (selectedItem) => selectedItem.toUpperCase() === item.toUpperCase(),
      );
    },
    [selectedItems],
  );

  return (
    <View className={"flex flex-col gap-3"}>
      <Text className={"font-sfPro font-medium text-black dark:text-white"}>
        {title}
      </Text>
      <View className={"flex flex-row flex-wrap gap-1.5"}>
        {data.map((item, index) =>
          isItemSelected(item) ? (
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
