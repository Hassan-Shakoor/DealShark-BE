import { Platform, StatusBar, View } from "react-native";
import { FunctionComponent, PropsWithChildren } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import className from "classnames";

type Props = {
  classNames?: string;
};

export const CustomSafeArea: FunctionComponent<PropsWithChildren<Props>> = ({
  children,
  classNames,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={className("flex-1", classNames)}
      style={{
        paddingTop:
          Platform.OS === "android" ? StatusBar.currentHeight : insets.top,
      }}
    >
      {children}
    </View>
  );
};
