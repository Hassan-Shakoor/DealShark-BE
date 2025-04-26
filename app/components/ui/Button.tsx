import { FunctionComponent, PropsWithChildren } from "react";
import { TouchableOpacity } from "react-native";
import className from "classnames";

type Props = {
  classNames?: string;
};

export const Button: FunctionComponent<PropsWithChildren<Props>> = ({
  classNames,
  children,
}) => {
  return (
    <TouchableOpacity
      className={className(
        "text-medium w-full items-center rounded-lg bg-primary p-4 text-sm",
        classNames,
      )}
    >
      {children}
    </TouchableOpacity>
  );
};
