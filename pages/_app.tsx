import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import CustomAlert from "@/components/ui/CustomAlert";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <Component {...pageProps} />
          <GlobalAlert />
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

const GlobalAlert = () => {
  const { alertOpen, alertMessage, alertType, closeAlert, alertScope } =
    useAuth();

  // Only show if alert is open and scope is global
  if (!alertOpen || alertScope !== "global") return null;

  return (
    <CustomAlert
      alerts={[{ id: 1, message: alertMessage, type: alertType }]}
      onClose={() => closeAlert()}
    />
  );
};
