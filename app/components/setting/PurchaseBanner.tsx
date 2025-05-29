import { FunctionComponent, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { ROUTES } from "@/app/utils/routes";

export const PurchaseBanner: FunctionComponent = () => {
  const handlePress = useCallback(() => {
    router.push(ROUTES.Purchase);
  }, []);

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="relative rounded-3xl"
      activeOpacity={0.7}
    >
      {/* Gradient border layer */}
      <LinearGradient
        colors={["#CD85C7", "#B6DAFE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="absolute inset-0"
        style={{ borderRadius: 24 }}
      />

      {/* Content layer */}
      <View className="m-1 flex flex-row items-center justify-between gap-1.5 rounded-3xl bg-tertiary p-4">
        <View className="flex flex-col">
          <Text className="font-inter text-lg font-medium text-white">
            Unlock All Features
          </Text>
          <Text className="font-inter text-xs text-white">
            Get access to unlimited chat,{"\n"}advanced ai model, custom persona
            {"\n"}selection
          </Text>
        </View>
        <Image
          source={require("@/assets/images/endless-intimacy-icon.png")}
          className="h-12 w-28"
        />
      </View>
    </TouchableOpacity>
  );
};
