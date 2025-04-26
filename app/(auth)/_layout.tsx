import { ReactElement } from "react";
import { Stack } from "expo-router";

const AuthLayout = (): ReactElement => {
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default AuthLayout;
