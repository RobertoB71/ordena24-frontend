import { useState } from "react";
import type { FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Ban,
  CheckCircle2,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import ProductoModal from "../Modals/ProductoModal";
import AdminTable from "../Table/AdminTable";
import type { AdminTableColumn } from "../Table/AdminTable";
import { useGeneralAlert } from "../../Alerts/GeneralAlerts/useGeneralAlert";
import type { Categoria } from "../../../models/categoria";
import type { Producto, ProductoPayload } from "../../../models/producto";
import { API_BASE_URL } from "../../../services/API/axiosInstance";
import { ProductoInstance } from "../../../services/Productos/productoService";

const getEmptyProductoForm = (categoriaId = 0): ProductoPayload => ({
  nombre: "",
  descripcion: "",
  precio: 0,
  categoria_id: categoriaId,
  disponible: true,
  imagen_url: "",
  imagen: null,
});

interface ProductosTabProps {
  productos: Producto[];
  categorias: Categoria[];
  loadingData: boolean;
  onDataChanged: () => Promise<void>;
}

export default function ProductosTab({
  productos,
  categorias,
  loadingData,
  onDataChanged,
}: ProductosTabProps) {
  const { confirm, showError, showSuccess } = useGeneralAlert();
  const shouldReduceMotion = useReducedMotion();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [productoForm, setProductoForm] = useState<ProductoPayload>(
    getEmptyProductoForm(categorias[0]?.id),
  );
  const [saving, setSaving] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const activeCategorias = categorias.filter((categoria) => categoria.activo);
  const modalCategorias = activeCategorias.length > 0 ? activeCategorias : categorias;

  const getCategoriaDescription = (categoriaId: number) => {
    return (
      categorias.find((categoria) => categoria.id === categoriaId)?.descripcion ??
      `Categoria ${categoriaId}`
    );
  };

  const getImageSrc = (imageUrl?: string | null) => {
    if (!imageUrl) {
      return null;
    }

    return imageUrl.startsWith("/") ? `${API_BASE_URL}${imageUrl}` : imageUrl;
  };

  const buildPayload = (form: ProductoPayload): ProductoPayload => ({
    nombre: form.nombre.trim(),
    descripcion: form.descripcion?.trim() || null,
    precio: Number(form.precio),
    categoria_id: Number(form.categoria_id),
    disponible: Boolean(form.disponible),
    imagen_url: form.imagen_url?.trim() || null,
    imagen: form.imagen ?? null,
  });

  const openCreateModal = () => {
    setSelectedProducto(null);
    setProductoForm(getEmptyProductoForm(modalCategorias[0]?.id));
    setModalOpen(true);
  };

  const openEditModal = (producto: Producto) => {
    setSelectedProducto(producto);
    setProductoForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? "",
      precio: producto.precio,
      categoria_id: producto.categoria_id,
      disponible: producto.disponible,
      imagen_url: producto.imagen_url ?? "",
      imagen: null,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProducto(null);
    setProductoForm(getEmptyProductoForm(modalCategorias[0]?.id));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      productoForm.imagen &&
      (!["image/png", "image/jpeg", "image/webp"].includes(productoForm.imagen.type) ||
        productoForm.imagen.size > 5 * 1024 * 1024)
    ) {
      showError("La imagen debe ser PNG, JPG o WEBP y no superar los 5 MB.");
      return;
    }

    setSaving(true);

    try {
      const payload = buildPayload(productoForm);

      if (selectedProducto) {
        await ProductoInstance.updateProducto(selectedProducto.id, payload);
        showSuccess("Producto actualizado correctamente.");
      } else {
        await ProductoInstance.createProducto(payload);
        showSuccess("Producto creado correctamente.");
      }

      closeModal();
      await onDataChanged();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo guardar el producto";

      showError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleProducto = async (producto: Producto) => {
    const nextStatus = !producto.disponible;
    const actionText = producto.disponible ? "marcar como no disponible" : "habilitar";

    const shouldChangeStatus = await confirm({
      title: producto.disponible ? "Deshabilitar producto" : "Habilitar producto",
      message: `Estas seguro de que quieres ${actionText} ${producto.nombre}?`,
      confirmText: producto.disponible ? "Deshabilitar" : "Habilitar",
      cancelText: "Cancelar",
      variant: producto.disponible ? "warning" : "info",
    });

    if (!shouldChangeStatus) {
      return;
    }

    setActionLoadingId(producto.id);

    try {
      await ProductoInstance.toggleProductoEstado(producto.id);

      showSuccess(
        nextStatus
          ? "Producto habilitado correctamente."
          : "Producto deshabilitado correctamente.",
      );
      await onDataChanged();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo cambiar la disponibilidad del producto";

      showError(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteProducto = async (producto: Producto) => {
    const shouldDelete = await confirm({
      title: "Eliminar producto",
      message: `Estas seguro de que quieres eliminar ${producto.nombre}?`,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "warning",
    });

    if (!shouldDelete) {
      return;
    }

    setActionLoadingId(producto.id);

    try {
      await ProductoInstance.deleteProducto(producto.id);
      showSuccess("Producto eliminado correctamente.");
      await onDataChanged();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo eliminar el producto";

      showError(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const columns: AdminTableColumn<Producto>[] = [
    {
      key: "producto",
      header: "Producto",
      render: (producto) => (
        <div className="flex min-w-0 items-center justify-end gap-3 text-left sm:justify-start">
          {producto.imagen_url ? (
            <img
              src={getImageSrc(producto.imagen_url) ?? ""}
              alt={producto.nombre}
              className="h-14 w-14 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-xs font-black text-orange-500">
              Sin foto
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-black text-stone-900">{producto.nombre}</p>
            {producto.descripcion && (
              <p className="mt-1 line-clamp-2 max-w-md text-xs font-medium text-stone-500">
                {producto.descripcion}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "categoria",
      header: "Categoria",
      render: (producto) => (
        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600">
          {getCategoriaDescription(producto.categoria_id)}
        </span>
      ),
    },
    {
      key: "precio",
      header: "Precio",
      render: (producto) => (
        <span className="font-bold text-stone-800">
          ${Number(producto.precio).toFixed(2)}
        </span>
      ),
    },
    {
      key: "estado",
      header: "Estado",
      render: (producto) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            producto.disponible
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {producto.disponible ? "Disponible" : "No disponible"}
        </span>
      ),
    },
    {
      key: "acciones",
      header: "Acciones",
      className: "text-right",
      render: (producto) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => openEditModal(producto)}
            className="rounded-lg p-2 text-orange-700 transition hover:bg-orange-50"
            aria-label={`Editar ${producto.nombre}`}
          >
            <Pencil size={18} />
          </button>
          <button
            type="button"
            onClick={() => void handleToggleProducto(producto)}
            disabled={actionLoadingId === producto.id}
            className="rounded-lg p-2 text-stone-600 transition hover:bg-orange-50 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={
              producto.disponible
                ? `Deshabilitar ${producto.nombre}`
                : `Habilitar ${producto.nombre}`
            }
          >
            {actionLoadingId === producto.id ? (
              <Loader2 size={18} className="animate-spin" />
            ) : producto.disponible ? (
              <Ban size={18} />
            ) : (
              <CheckCircle2 size={18} />
            )}
          </button>
          <button
            type="button"
            onClick={() => void handleDeleteProducto(producto)}
            disabled={actionLoadingId === producto.id}
            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Eliminar ${producto.nombre}`}
          >
            {actionLoadingId === producto.id ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-black text-[#240800]">Productos</h2>
          <p className="mt-2 text-sm font-medium text-stone-500">
            Crea, actualiza y gestiona la disponibilidad del menu.
          </p>
        </div>

        <motion.button
          type="button"
          onClick={openCreateModal}
          disabled={modalCategorias.length === 0}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          whileHover={shouldReduceMotion ? undefined : { y: -1 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
        >
          <Plus size={18} />
          Nuevo producto
        </motion.button>
      </div>

      {loadingData ? (
        <div className="flex min-h-64 items-center justify-center rounded-lg border border-orange-100 bg-white">
          <Loader2 size={28} className="animate-spin text-orange-500" />
        </div>
      ) : (
        <AdminTable
          columns={columns}
          data={productos}
          emptyMessage="No hay productos registrados."
          getRowKey={(producto) => producto.id}
        />
      )}

      {modalOpen && (
        <ProductoModal
          producto={selectedProducto}
          productoForm={productoForm}
          categorias={modalCategorias}
          loading={saving}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onChange={setProductoForm}
        />
      )}
    </>
  );
}
