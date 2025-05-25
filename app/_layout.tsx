import "../global.css";
import { AuthProvider } from "@/app/contexts/useAuthContext";
import LayoutContent from "@/app/components/layout/LayoutContent";

export default function RootLayout() {
  return (
    <AuthProvider>
      <LayoutContent />
    </AuthProvider>
  );
}
