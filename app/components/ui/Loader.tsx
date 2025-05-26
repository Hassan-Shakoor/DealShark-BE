import { ActivityIndicator, View } from "react-native";
import { FunctionComponent } from "react";

type Props = {
  size?: "small" | "large";
  color?: string;
};

const Loader: FunctionComponent<Props> = ({ size, color }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={size ?? "large"} color={color ?? "#ffffff"} />
    </View>
  );
};

export default Loader;
