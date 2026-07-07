import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  X,
  XCircle,
} from "lucide-react";

import {
  GeneralAlertContext,
  type AlertOptions,
  type AlertVariant,
  type ConfirmOptions,
} from "./GeneralAlertContext";

interface AlertState extends Required<Omit<AlertOptions, "title">> {
  id: number;
  title?: string;
}

interface ConfirmState extends Required<ConfirmOptions> {
  resolve: (value: boolean) => void;
}

const variantStyles: Record<
  AlertVariant,
  { icon: typeof CheckCircle2; border: string; bg: string; text: string; iconText: string }
> = {
  success: {
    icon: CheckCircle2,
    border: "border-emerald-100",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    iconText: "text-emerald-600",
  },
  error: {
    icon: XCircle,
    border: "border-red-100",
    bg: "bg-red-50",
    text: "text-red-700",
    iconText: "text-red-600",
  },
  info: {
    icon: Info,
    border: "border-sky-100",
    bg: "bg-sky-50",
    text: "text-sky-800",
    iconText: "text-sky-600",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-orange-100",
    bg: "bg-orange-50",
    text: "text-orange-800",
    iconText: "text-orange-600",
  },
};

export default function GeneralAlertProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const alertTimeoutRef = useRef<number | null>(null);

  const closeAlert = useCallback(() => {
    if (alertTimeoutRef.current) {
      window.clearTimeout(alertTimeoutRef.current);
      alertTimeoutRef.current = null;
    }

    setAlert(null);
  }, []);

  const showAlert = useCallback(
    ({ title, message, variant = "info", duration = 3500 }: AlertOptions) => {
      closeAlert();

      const id = Date.now();
      setAlert({ id, title, message, variant, duration });

      if (duration > 0) {
        alertTimeoutRef.current = window.setTimeout(() => {
          setAlert((current) => (current?.id === id ? null : current));
          alertTimeoutRef.current = null;
        }, duration);
      }
    },
    [closeAlert]
  );

  const showSuccess = useCallback(
    (message: string, title = "Listo") => {
      showAlert({ title, message, variant: "success" });
    },
    [showAlert]
  );

  const showError = useCallback(
    (message: string, title = "Ocurrio un error") => {
      showAlert({ title, message, variant: "error", duration: 5000 });
    },
    [showAlert]
  );

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({
        title: options.title ?? "Confirmar accion",
        message: options.message,
        confirmText: options.confirmText ?? "Confirmar",
        cancelText: options.cancelText ?? "Cancelar",
        variant: options.variant ?? "warning",
        resolve,
      });
    });
  }, []);

  const closeConfirm = (value: boolean) => {
    setConfirmState((current) => {
      current?.resolve(value);
      return null;
    });
  };

  const value = useMemo(
    () => ({
      showAlert,
      showSuccess,
      showError,
      confirm,
    }),
    [confirm, showAlert, showError, showSuccess]
  );

  const alertStyle = alert ? variantStyles[alert.variant] : null;
  const AlertIcon = alertStyle?.icon ?? Loader2;
  const confirmStyle = confirmState ? variantStyles[confirmState.variant] : null;
  const ConfirmIcon = confirmStyle?.icon ?? AlertTriangle;

  return (
    <GeneralAlertContext.Provider value={value}>
      {children}

      {alert && alertStyle && (
        <div className="fixed right-4 top-4 z-[70] w-[calc(100%-2rem)] max-w-sm">
          <div
            className={`flex gap-3 rounded-lg border ${alertStyle.border} ${alertStyle.bg} p-4 text-left shadow-xl shadow-stone-900/10`}
            role="status"
          >
            <AlertIcon
              size={22}
              className={`mt-0.5 shrink-0 ${alertStyle.iconText}`}
            />
            <div className="min-w-0 flex-1">
              {alert.title && (
                <p className={`font-black ${alertStyle.text}`}>{alert.title}</p>
              )}
              <p className={`text-sm font-medium leading-6 ${alertStyle.text}`}>
                {alert.message}
              </p>
            </div>
            <button
              type="button"
              onClick={closeAlert}
              className={`rounded-lg p-1 transition hover:bg-white/60 ${alertStyle.text}`}
              aria-label="Cerrar alerta"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {confirmState && confirmStyle && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-950/45 px-4 py-6">
          <div className="w-full max-w-md rounded-lg border border-orange-100 bg-white p-6 text-left shadow-2xl">
            <div className="flex gap-4">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${confirmStyle.bg} ${confirmStyle.iconText}`}
              >
                <ConfirmIcon size={24} />
              </span>
              <div>
                <h3 className="text-xl font-black text-[#240800]">
                  {confirmState.title}
                </h3>
                <p className="mt-2 text-sm font-medium leading-6 text-stone-500">
                  {confirmState.message}
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => closeConfirm(false)}
                className="rounded-lg border border-stone-200 px-5 py-3 text-sm font-bold text-stone-600 transition hover:bg-stone-50"
              >
                {confirmState.cancelText}
              </button>
              <button
                type="button"
                onClick={() => closeConfirm(true)}
                className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
              >
                {confirmState.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </GeneralAlertContext.Provider>
  );
}
