import { FunctionComponent, PropsWithChildren } from "react";
import { TouchableOpacity } from "react-native";
import className from "classnames";

type Props = {
  disabled?: boolean;
  onPress?: () => void;
  classNames?: string;
};

export const Button: FunctionComponent<PropsWithChildren<Props>> = ({
  disabled,
  onPress,
  classNames,
  children,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      className={className(
        "text-medium w-full items-center rounded-lg bg-primary p-4 text-sm disabled:bg-primary/30",
        classNames,
      )}
    >
      {children}
    </TouchableOpacity>
  );
};
