import React from "react";
import ReactDOM from "react-dom/client";

import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import GeneralAlertProvider from "./components/Alerts/GeneralAlerts/GeneralAlertProvider";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <GeneralAlertProvider>
          <AppRouter />
        </GeneralAlertProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
