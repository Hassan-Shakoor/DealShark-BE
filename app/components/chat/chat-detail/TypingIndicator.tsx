import { FunctionComponent, useCallback, useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import className from "classnames";

const DOT_COLOR_ACTIVE = "#FFFFFF";
const DOT_COLOR_INACTIVE = "#939393";

const AnimatedDot: FunctionComponent<{
  opacity: Animated.AnimatedInterpolation<any>;
}> = ({ opacity }) => (
  <Animated.View
    className={"size-2 rounded-full"}
    style={{ opacity, backgroundColor: DOT_COLOR_ACTIVE }}
  />
);

export const TypingIndicator: FunctionComponent = () => {
  const activeDotPosition = useRef(new Animated.Value(0)).current;

  const animateDots = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(activeDotPosition, {
          toValue: 2,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [activeDotPosition]);

  useEffect(() => {
    animateDots();
    return () => activeDotPosition.stopAnimation();
  }, [activeDotPosition, animateDots]);

  const dot1Opacity = activeDotPosition.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [1, 0.3, 0.3],
  });

  const dot2Opacity = activeDotPosition.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0.3, 1, 0.3],
  });

  const dot3Opacity = activeDotPosition.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0.3, 0.3, 1],
  });

  return (
    <View
      className={className(
        "flex w-fit max-w-[80%] flex-row gap-1 self-start rounded-3xl rounded-bl-none bg-light-quaternary px-5 py-3 dark:bg-dark-secondary",
      )}
    >
      <AnimatedDot opacity={dot1Opacity} />
      <AnimatedDot opacity={dot2Opacity} />
      <AnimatedDot opacity={dot3Opacity} />
    </View>
  );
};
