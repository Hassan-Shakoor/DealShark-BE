import "../global.css";
import { AuthProvider } from "@/app/contexts/useAuthContext";
import LayoutContent from "@/app/components/layout/LayoutContent";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <AuthProvider>
      <LayoutContent />
      <Toast />
    </AuthProvider>
  );
}
