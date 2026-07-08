import type { FormEvent } from "react";

import type { Categoria, CategoriaPayload } from "../../../models/categoria";
import AdminModal from "./AdminModal";

interface CategoriaModalProps {
  categoria: Categoria | null;
  categoriaForm: CategoriaPayload;
  loading: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (categoria: CategoriaPayload) => void;
}

export default function CategoriaModal({
  categoria,
  categoriaForm,
  loading,
  onClose,
  onSubmit,
  onChange,
}: CategoriaModalProps) {
  return (
    <AdminModal
      title={categoria ? "Editar categoria" : "Nueva categoria"}
      submitLabel={categoria ? "Actualizar categoria" : "Crear categoria"}
      loading={loading}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <div>
        <label className="block text-sm font-bold text-stone-700">
          Descripcion
        </label>
        <input
          type="text"
          value={categoriaForm.descripcion}
          onChange={(event) =>
            onChange({
              ...categoriaForm,
              descripcion: event.target.value,
            })
          }
          className="mt-2 w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
          placeholder="Ej: Bebidas"
          required
        />
      </div>
    </AdminModal>
  );
}
