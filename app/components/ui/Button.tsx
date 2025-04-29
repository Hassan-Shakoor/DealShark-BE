import { FunctionComponent, PropsWithChildren } from "react";
import { TouchableOpacity } from "react-native";
import className from "classnames";

type Props = {
  variant?: "primary" | "danger" | "secondary";
  disabled?: boolean;
  onPress?: () => void;
  classNames?: string;
};

export const Button: FunctionComponent<PropsWithChildren<Props>> = ({
  variant = "primary",
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
        "text-medium w-full items-center rounded-lg p-4 text-sm disabled:bg-primary/30",
        {
          "bg-primary": variant === "primary",
          "bg-danger": variant === "danger",
          "bg-quinary p-3 dark:bg-quaternary": variant === "secondary",
        },
        classNames,
      )}
    >
      {children}
    </TouchableOpacity>
  );
};
