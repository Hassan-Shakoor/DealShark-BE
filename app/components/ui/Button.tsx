import { FunctionComponent, PropsWithChildren } from "react";
import { TouchableOpacity } from "react-native";
import className from "classnames";

type Props = {
  onPress: () => void;
  classNames?: string;
};

export const Button: FunctionComponent<PropsWithChildren<Props>> = ({
  onPress,
  classNames,
  children,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={className(
        "text-medium w-full items-center rounded-lg bg-primary p-4 text-sm",
        classNames,
      )}
    >
      {children}
    </TouchableOpacity>
  );
};
