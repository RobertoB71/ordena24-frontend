import { useState } from "react";
import type { FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Ban, CheckCircle2, Loader2, Pencil, Plus } from "lucide-react";

import CategoriaModal from "../Modals/CategoriaModal";
import AdminTable from "../Table/AdminTable";
import type { AdminTableColumn } from "../Table/AdminTable";
import { useGeneralAlert } from "../../Alerts/GeneralAlerts/useGeneralAlert";
import type { Categoria, CategoriaPayload } from "../../../models/categoria";
import { CategoriaInstance } from "../../../services/Categorias/categoriaService";

const emptyCategoriaForm: CategoriaPayload = {
  descripcion: "",
};

interface CategoriasTabProps {
  categorias: Categoria[];
  loadingData: boolean;
  onDataChanged: () => Promise<void>;
}

export default function CategoriasTab({
  categorias,
  loadingData,
  onDataChanged,
}: CategoriasTabProps) {
  const { confirm, showError, showSuccess } = useGeneralAlert();
  const shouldReduceMotion = useReducedMotion();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [categoriaForm, setCategoriaForm] =
    useState<CategoriaPayload>(emptyCategoriaForm);
  const [saving, setSaving] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const openCreateModal = () => {
    setSelectedCategoria(null);
    setCategoriaForm(emptyCategoriaForm);
    setModalOpen(true);
  };

  const openEditModal = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setCategoriaForm({
      descripcion: categoria.descripcion,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCategoria(null);
    setCategoriaForm(emptyCategoriaForm);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    const descripcion = categoriaForm.descripcion.trim();

    try {
      if (selectedCategoria) {
        await CategoriaInstance.updateCategoria(selectedCategoria.id, {
          descripcion,
          activo: selectedCategoria.activo,
        });
        showSuccess("Categoria actualizada correctamente.");
      } else {
        await CategoriaInstance.createCategoria({ descripcion });
        showSuccess("Categoria creada correctamente.");
      }

      closeModal();
      await onDataChanged();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo guardar la categoria";

      showError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleCategoria = async (categoria: Categoria) => {
    const nextStatus = !categoria.activo;
    const actionText = categoria.activo ? "deshabilitar" : "habilitar";

    const shouldChangeStatus = await confirm({
      title: categoria.activo ? "Deshabilitar categoria" : "Habilitar categoria",
      message: `Estas seguro que deseas ${actionText} la categoria ${categoria.descripcion}?`,
      confirmText: categoria.activo ? "Deshabilitar" : "Habilitar",
      cancelText: "Cancelar",
      variant: categoria.activo ? "warning" : "info",
    });

    if (!shouldChangeStatus) {
      return;
    }

    setActionLoadingId(categoria.id);

    try {
      await CategoriaInstance.updateCategoria(categoria.id, {
        descripcion: categoria.descripcion,
        activo: nextStatus,
      });

      showSuccess(
        nextStatus
          ? "Categoria habilitada correctamente."
          : "Categoria deshabilitada correctamente.",
      );
      await onDataChanged();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo cambiar el estado de la categoria";

      showError(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const columns: AdminTableColumn<Categoria>[] = [
    {
      key: "descripcion",
      header: "Categoria",
      render: (categoria) => (
        <p className="font-black text-stone-900">{categoria.descripcion}</p>
      ),
    },
    {
      key: "estado",
      header: "Estado",
      render: (categoria) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            categoria.activo ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
          }`}
        >
          {categoria.activo ? "Activa" : "Inactiva"}
        </span>
      ),
    },
    {
      key: "acciones",
      header: "Acciones",
      className: "text-right",
      render: (categoria) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => openEditModal(categoria)}
            className="rounded-lg p-2 text-orange-700 transition hover:bg-orange-50"
            aria-label={`Editar ${categoria.descripcion}`}
          >
            <Pencil size={18} />
          </button>
          <button
            type="button"
            onClick={() => void handleToggleCategoria(categoria)}
            disabled={actionLoadingId === categoria.id}
            className="rounded-lg p-2 text-stone-600 transition hover:bg-orange-50 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={
              categoria.activo
                ? `Deshabilitar ${categoria.descripcion}`
                : `Habilitar ${categoria.descripcion}`
            }
          >
            {actionLoadingId === categoria.id ? (
              <Loader2 size={18} className="animate-spin" />
            ) : categoria.activo ? (
              <Ban size={18} />
            ) : (
              <CheckCircle2 size={18} />
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#240800]">Categorias</h2>
          <p className="mt-2 text-sm font-medium text-stone-500">
            Crea y actualiza las categorias visibles del menu.
          </p>
        </div>

        <motion.button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
          whileHover={shouldReduceMotion ? undefined : { y: -1 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
        >
          <Plus size={18} />
          Nueva categoria
        </motion.button>
      </div>

      {loadingData ? (
        <div className="flex min-h-64 items-center justify-center rounded-lg border border-orange-100 bg-white">
          <Loader2 size={28} className="animate-spin text-orange-500" />
        </div>
      ) : (
        <AdminTable
          columns={columns}
          data={categorias}
          emptyMessage="No hay categorias registradas."
          getRowKey={(categoria) => categoria.id}
        />
      )}

      {modalOpen && (
        <CategoriaModal
          categoria={selectedCategoria}
          categoriaForm={categoriaForm}
          loading={saving}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onChange={setCategoriaForm}
        />
      )}
    </>
  );
}
