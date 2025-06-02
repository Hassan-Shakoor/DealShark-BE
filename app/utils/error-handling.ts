import { isAxiosError } from "axios";
import Toast from "react-native-toast-message";

export const handleError = (error: unknown) => {
  if (isAxiosError(error) && error.code === "ERR_CANCELED") {
    // Request was cancelled, do nothing
    return;
  }
  const detail = isAxiosError(error)
    ? error?.response?.data?.detail
    : undefined;

  if (detail === "Invalid token") {
    return;
  }

  if (detail || error) {
    Toast.show({
      type: "error",
      text1: detail ?? error,
    });
  }
  console.error(detail ?? error);
};
