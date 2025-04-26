import { FunctionComponent, PropsWithChildren, useMemo } from "react";
import { Theme } from "@/app/utils/constant";
import { ImageBackground, View, Text } from "react-native";
import { useColorScheme } from "nativewind";

export const ChatBackground: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = useMemo(() => colorScheme === Theme.Dark, [colorScheme]);

  const backgroundSource = useMemo(
    () =>
      isDark
        ? require("@/assets/images/chat-dark-background.png")
        : require("@/assets/images/chat-light-background.png"),
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
