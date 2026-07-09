import type { FormEvent, ReactNode } from "react";
import { Loader2, Save, X } from "lucide-react";

interface AdminModalProps {
  title: string;
  children: ReactNode;
  submitLabel: string;
  loading: boolean;
  size?: "md" | "lg";
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function AdminModal({
  title,
  children,
  submitLabel,
  loading,
  size = "md",
  onClose,
  onSubmit,
}: AdminModalProps) {
  const maxWidth = size === "lg" ? "max-w-4xl" : "max-w-lg";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 px-3 py-4 sm:px-4 sm:py-6">
      <div
        className={`flex max-h-[calc(100vh-2rem)] w-full ${maxWidth} flex-col overflow-hidden rounded-lg border border-orange-100 bg-white text-left shadow-2xl sm:max-h-[calc(100vh-3rem)]`}
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-orange-50 px-5 py-4 sm:px-6">
          <h3 className="text-2xl font-black text-[#240800]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-stone-500 transition hover:bg-orange-50 hover:text-orange-600"
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            {children}
          </div>

          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-orange-50 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stone-200 px-5 py-3 text-sm font-bold text-stone-600 transition hover:bg-stone-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {loading ? "Guardando..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
