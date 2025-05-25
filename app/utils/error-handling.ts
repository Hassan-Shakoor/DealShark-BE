import { isAxiosError } from "axios";

export const handleError = (error: unknown) => {
  if (isAxiosError(error) && error.code === "ERR_CANCELED") {
    // Request was cancelled, do nothing
    return;
  }
  console.error(isAxiosError(error) ? error?.response?.data.detail : error);
};
