import { isAxiosError } from "axios";
import Toast from "react-native-toast-message";

export const handleError = (error: unknown) => {
  if (isAxiosError(error) && error.code === "ERR_CANCELED") {
    // Request was cancelled, do nothing
    return;
  }
  Toast.show({
    type: "error",
    text1: isAxiosError(error) ? error?.response?.data.detail : error,
  });
  console.error(isAxiosError(error) ? error?.response?.data.detail : error);
};
