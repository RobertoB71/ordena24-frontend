import { useEffect, useMemo } from "react";
import type { DragEvent, FormEvent } from "react";
import { ImagePlus, Upload, X } from "lucide-react";

import type { Categoria } from "../../../models/categoria";
import type { Producto, ProductoPayload } from "../../../models/producto";
import { API_BASE_URL } from "../../../services/API/axiosInstance";
import AdminModal from "./AdminModal";

interface ProductoModalProps {
  producto: Producto | null;
  productoForm: ProductoPayload;
  categorias: Categoria[];
  loading: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (producto: ProductoPayload) => void;
}

export default function ProductoModal({
  producto,
  productoForm,
  categorias,
  loading,
  onClose,
  onSubmit,
  onChange,
}: ProductoModalProps) {
  const fieldClass =
    "mt-2 w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100";
  const labelClass = "block text-sm font-bold text-stone-700";

  const updateForm = (payload: Partial<ProductoPayload>) => {
    onChange({
      ...productoForm,
      ...payload,
    });
  };

  const selectedImagePreview = useMemo(() => {
    if (!productoForm.imagen) {
      return null;
    }

    return URL.createObjectURL(productoForm.imagen);
  }, [productoForm.imagen]);

  useEffect(() => {
    return () => {
      if (selectedImagePreview) {
        URL.revokeObjectURL(selectedImagePreview);
      }
    };
  }, [selectedImagePreview]);

  const imageSrc =
    selectedImagePreview ??
    (productoForm.imagen_url?.startsWith("/")
      ? `${API_BASE_URL}${productoForm.imagen_url}`
      : productoForm.imagen_url);

  const handleFile = (file?: File) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    updateForm({ imagen: file });
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files[0]);
  };

  return (
    <AdminModal
      title={producto ? "Editar producto" : "Nuevo producto"}
      submitLabel={producto ? "Actualizar producto" : "Crear producto"}
      loading={loading}
      size="lg"
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Nombre</label>
            <input
              type="text"
              value={productoForm.nombre}
              onChange={(event) => updateForm({ nombre: event.target.value })}
              className={fieldClass}
              placeholder="Ej: Hamburguesa clasica"
              required
            />
          </div>

          <div>
            <label className={labelClass}>Descripcion</label>
            <textarea
              value={productoForm.descripcion ?? ""}
              onChange={(event) => updateForm({ descripcion: event.target.value })}
              className={`${fieldClass} min-h-32 resize-y leading-6`}
              placeholder="Describe ingredientes o detalles del producto"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Precio</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={productoForm.precio}
                onChange={(event) =>
                  updateForm({ precio: Number(event.target.value) })
                }
                className={fieldClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Categoria</label>
              <select
                value={productoForm.categoria_id}
                onChange={(event) =>
                  updateForm({ categoria_id: Number(event.target.value) })
                }
                className={fieldClass}
                required
              >
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.descripcion}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <aside className="space-y-3">
          <div>
            <label className={labelClass}>Imagen del producto</label>
            <label
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              className={`relative mt-2 flex aspect-[4/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed text-center transition ${
                imageSrc
                  ? "border-orange-100 bg-stone-100 hover:border-orange-300"
                  : "border-orange-200 bg-orange-50/60 px-4 py-6 hover:border-orange-300 hover:bg-orange-50"
              }`}
            >
              {imageSrc ? (
                <>
                  <img
                    src={imageSrc}
                    alt="Vista previa del producto"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-white/95 px-3 py-2 backdrop-blur">
                    <span className="min-w-0 truncate text-xs font-medium text-stone-600">
                      {productoForm.imagen?.name ?? productoForm.imagen_url}
                    </span>
                    <span className="shrink-0 text-xs font-black text-orange-600">
                      Cambiar
                    </span>
                  </div>
                  {productoForm.imagen && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        updateForm({ imagen: null });
                      }}
                      className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-red-600 shadow-sm transition hover:bg-red-50"
                      aria-label="Quitar imagen seleccionada"
                    >
                      <X size={16} />
                    </button>
                  )}
                </>
              ) : (
                <>
                  <ImagePlus size={30} className="text-orange-500" />
                  <span className="mt-3 text-sm font-black text-stone-700">
                    Arrastra una foto aqui
                  </span>
                  <span className="mt-1 text-xs font-medium leading-5 text-stone-500">
                    o selecciona un archivo PNG, JPG o WEBP de hasta 5 MB
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => handleFile(event.target.files?.[0])}
                className="sr-only"
                disabled={loading}
              />
            </label>
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-stone-50 px-3 py-2 text-xs font-medium leading-5 text-stone-500">
            <Upload size={14} className="mt-0.5 shrink-0" />
            <span>
              La imagen se sube al guardar el producto y el server devuelve la URL.
            </span>
          </div>
        </aside>
      </div>
    </AdminModal>
  );
}
