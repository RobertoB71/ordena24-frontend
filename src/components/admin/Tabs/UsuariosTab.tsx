import { useState } from "react";
import type { FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Ban, CheckCircle2, Loader2, Pencil, Plus } from "lucide-react";

import UsuarioModal from "../Modals/UsuarioModal";
import AdminTable from "../Table/AdminTable";
import type { AdminTableColumn } from "../Table/AdminTable";
import { useGeneralAlert } from "../../Alerts/GeneralAlerts/useGeneralAlert";
import type {
  Rol,
  Usuario,
  UsuarioCreatePayload,
  UsuarioPayload,
} from "../../../models/usuario";
import { UsuarioInstance } from "../../../services/Usuarios/usuarioService";

const emptyUsuarioForm: UsuarioPayload = {
  nombre: "",
  email: "",
  rol_id: 1,
  password: "",
};

interface UsuariosTabProps {
  usuarios: Usuario[];
  roles: Rol[];
  loadingData: boolean;
  onDataChanged: () => Promise<void>;
}

export default function UsuariosTab({
  usuarios,
  roles,
  loadingData,
  onDataChanged,
}: UsuariosTabProps) {
  const { confirm, showError, showSuccess } = useGeneralAlert();
  const shouldReduceMotion = useReducedMotion();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [usuarioForm, setUsuarioForm] = useState<UsuarioPayload>(emptyUsuarioForm);
  const [saving, setSaving] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const getRoleDescription = (roleId: number) => {
    return roles.find((role) => role.id === roleId)?.descripcion ?? `Rol ${roleId}`;
  };

  const openCreateModal = () => {
    setSelectedUsuario(null);
    setUsuarioForm({
      ...emptyUsuarioForm,
      rol_id: roles[0]?.id ?? emptyUsuarioForm.rol_id,
    });
    setModalOpen(true);
  };

  const openEditModal = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setUsuarioForm({
      nombre: usuario.nombre,
      email: usuario.email,
      rol_id: usuario.rol_id,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUsuario(null);
    setUsuarioForm(emptyUsuarioForm);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      if (selectedUsuario) {
        const payload: Partial<UsuarioPayload> = {
          nombre: usuarioForm.nombre.trim(),
          email: usuarioForm.email.trim(),
          rol_id: Number(usuarioForm.rol_id),
        };

        await UsuarioInstance.updateUsuario(selectedUsuario.id, payload);
        showSuccess("Usuario actualizado correctamente.");
      } else {
        const payload: UsuarioCreatePayload = {
          nombre: usuarioForm.nombre.trim(),
          email: usuarioForm.email.trim(),
          password: usuarioForm.password?.trim() ?? "",
          rol_id: Number(usuarioForm.rol_id),
        };

        await UsuarioInstance.createUsuario(payload);
        showSuccess("Usuario creado correctamente.");
      }

      closeModal();
      await onDataChanged();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo guardar el usuario";

      showError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleUsuario = async (usuario: Usuario) => {
    const shouldChangeStatus = await confirm({
      title: usuario.activo ? "Deshabilitar usuario" : "Habilitar usuario",
      message: `Estas seguro de que quieres ${
        usuario.activo ? "deshabilitar" : "habilitar"
      } a ${usuario.nombre}?`,
      confirmText: usuario.activo ? "Deshabilitar" : "Habilitar",
      cancelText: "Cancelar",
      variant: usuario.activo ? "warning" : "info",
    });

    if (!shouldChangeStatus) {
      return;
    }

    setActionLoadingId(usuario.id);

    try {
      if (usuario.activo) {
        await UsuarioInstance.deshabilitarUsuario(usuario.id);
        showSuccess("Usuario deshabilitado correctamente.");
      } else {
        await UsuarioInstance.habilitarUsuario(usuario.id);
        showSuccess("Usuario habilitado correctamente.");
      }

      await onDataChanged();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo cambiar el estado del usuario";

      showError(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const columns: AdminTableColumn<Usuario>[] = [
    {
      key: "nombre",
      header: "Nombre",
      render: (usuario) => (
        <div>
          <p className="font-black text-stone-900">{usuario.nombre}</p>
          <p className="mt-1 text-xs font-medium text-stone-500">{usuario.email}</p>
        </div>
      ),
    },
    {
      key: "rol",
      header: "Rol",
      render: (usuario) => (
        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600">
          {getRoleDescription(usuario.rol_id)}
        </span>
      ),
    },
    {
      key: "estado",
      header: "Estado",
      render: (usuario) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            usuario.activo ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
          }`}
        >
          {usuario.activo ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      key: "acciones",
      header: "Acciones",
      className: "text-right",
      render: (usuario) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => openEditModal(usuario)}
            className="rounded-lg p-2 text-orange-700 transition hover:bg-orange-50"
            aria-label={`Editar ${usuario.nombre}`}
          >
            <Pencil size={18} />
          </button>
          <button
            type="button"
            onClick={() => void handleToggleUsuario(usuario)}
            disabled={actionLoadingId === usuario.id}
            className="rounded-lg p-2 text-stone-600 transition hover:bg-orange-50 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={
              usuario.activo
                ? `Deshabilitar ${usuario.nombre}`
                : `Habilitar ${usuario.nombre}`
            }
          >
            {actionLoadingId === usuario.id ? (
              <Loader2 size={18} className="animate-spin" />
            ) : usuario.activo ? (
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
          <h2 className="text-2xl font-black text-[#240800]">Usuarios</h2>
          <p className="mt-2 text-sm font-medium text-stone-500">
            Administra accesos, roles y estados de usuarios.
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
          Nuevo usuario
        </motion.button>
      </div>

      {loadingData ? (
        <div className="flex min-h-64 items-center justify-center rounded-lg border border-orange-100 bg-white">
          <Loader2 size={28} className="animate-spin text-orange-500" />
        </div>
      ) : (
        <AdminTable
          columns={columns}
          data={usuarios}
          emptyMessage="No hay usuarios registrados."
          getRowKey={(usuario) => usuario.id}
        />
      )}

      {modalOpen && (
        <UsuarioModal
          usuario={selectedUsuario}
          usuarioForm={usuarioForm}
          roles={roles}
          loading={saving}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onChange={setUsuarioForm}
        />
      )}
    </>
  );
}
