import { FunctionComponent, PropsWithChildren, useMemo } from "react";
import { Theme } from "@/app/utils/constant";
import { ImageBackground, View } from "react-native";
import { useColorScheme } from "nativewind";

export const CompanionBackground: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = useMemo(() => colorScheme === Theme.Dark, [colorScheme]);

  const backgroundSource = useMemo(
    () =>
      isDark
        ? require("@/assets/images/companion-dark-background.png")
        : require("@/assets/images/companion-light-background.png"),
    [isDark],
  );

  return (
    <View className="flex-1">
      {/* PNG Background */}
      <ImageBackground
        source={backgroundSource}
        className="absolute inset-0"
        resizeMode="cover"
      >
        <View className={`flex-1`}>{children}</View>
      </ImageBackground>
    </View>
  );
};
