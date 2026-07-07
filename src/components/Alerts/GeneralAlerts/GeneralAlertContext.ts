import { createContext } from "react";

export type AlertVariant = "success" | "error" | "info" | "warning";

export interface AlertOptions {
  title?: string;
  message: string;
  variant?: AlertVariant;
  duration?: number;
}

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: AlertVariant;
}

export interface GeneralAlertContextType {
  showAlert: (options: AlertOptions) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

export const GeneralAlertContext =
  createContext<GeneralAlertContextType | null>(null);
