import type { FormEvent } from "react";

import type { Rol, Usuario, UsuarioPayload } from "../../../models/usuario";
import AdminModal from "./AdminModal";

interface UsuarioModalProps {
  usuario: Usuario | null;
  usuarioForm: UsuarioPayload;
  roles: Rol[];
  loading: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (usuario: UsuarioPayload) => void;
}

export default function UsuarioModal({
  usuario,
  usuarioForm,
  roles,
  loading,
  onClose,
  onSubmit,
  onChange,
}: UsuarioModalProps) {
  const updateForm = (payload: Partial<UsuarioPayload>) => {
    onChange({
      ...usuarioForm,
      ...payload,
    });
  };

  return (
    <AdminModal
      title={usuario ? "Editar usuario" : "Nuevo usuario"}
      submitLabel={usuario ? "Actualizar usuario" : "Crear usuario"}
      loading={loading}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <div>
        <label className="block text-sm font-bold text-stone-700">Nombre</label>
        <input
          type="text"
          value={usuarioForm.nombre}
          onChange={(event) => updateForm({ nombre: event.target.value })}
          className="mt-2 w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-stone-700">
          Correo electronico
        </label>
        <input
          type="email"
          value={usuarioForm.email}
          onChange={(event) => updateForm({ email: event.target.value })}
          className="mt-2 w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-stone-700">Rol</label>
        <select
          value={usuarioForm.rol_id}
          onChange={(event) => updateForm({ rol_id: Number(event.target.value) })}
          className="mt-2 w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
          required
        >
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.descripcion}
            </option>
          ))}
        </select>
      </div>

      {!usuario && (
        <div>
          <label className="block text-sm font-bold text-stone-700">
            Contrasena
          </label>
          <input
            type="password"
            value={usuarioForm.password ?? ""}
            onChange={(event) => updateForm({ password: event.target.value })}
            className="mt-2 w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
            placeholder="Minimo 6 caracteres"
            minLength={6}
            required
          />
        </div>
      )}
    </AdminModal>
  );
}
