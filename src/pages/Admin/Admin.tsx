import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Ban,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  LayoutDashboard,
  Loader2,
  LogOut,
  Package,
  Pencil,
  Plus,
  Save,
  Tags,
  UserRound,
  Users,
  X,
} from "lucide-react";

import AdminTable from "../../components/admin/AdminTable";
import type { AdminTableColumn } from "../../components/admin/AdminTable";
import { useGeneralAlert } from "../../components/Alerts/GeneralAlerts/useGeneralAlert";
import Navbar from "../../components/navbar/Navbar";
import { useAuth } from "../../hooks/Auth/useAuth";
import type { Categoria, CategoriaPayload } from "../../models/categoria";
import type {
  Rol,
  Usuario,
  UsuarioCreatePayload,
  UsuarioPayload,
} from "../../models/usuario";
import { CategoriaInstance } from "../../services/Categorias/categoriaService";
import { UsuarioInstance } from "../../services/Usuarios/usuarioService";

type AdminTab = "usuarios" | "categorias";

const adminTabs = [
  { key: "dashboard", name: "Dashboard", icon: LayoutDashboard, disabled: true },
  { key: "usuarios", name: "Usuarios", icon: Users },
  { key: "productos", name: "Productos", icon: Package, disabled: true },
  { key: "categorias", name: "Categorias", icon: Tags },
  { key: "pedidos", name: "Pedidos", icon: ClipboardList, disabled: true },
  { key: "reportes", name: "Reportes", icon: BarChart3, disabled: true },
] as const;

const emptyCategoriaForm: CategoriaPayload = {
  nombre: "",
  descripcion: "",
};

const emptyUsuarioForm: UsuarioPayload = {
  nombre: "",
  email: "",
  rol_id: 1,
  password: "",
};

const fetchAdminData = async () => {
  const [usuariosResponse, categoriasResponse, rolesResponse] = await Promise.all([
    UsuarioInstance.getUsuarios(),
    CategoriaInstance.getCategorias(),
    UsuarioInstance.getRoles(),
  ]);

  return {
    usuarios: usuariosResponse.data,
    categorias: categoriasResponse.data,
    roles: rolesResponse.data,
  };
};

interface AdminModalProps {
  title: string;
  children: ReactNode;
  submitLabel: string;
  loading: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function AdminModal({
  title,
  children,
  submitLabel,
  loading,
  onClose,
  onSubmit,
}: AdminModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 px-4 py-6">
      <div className="w-full max-w-lg rounded-lg border border-orange-100 bg-white p-6 text-left shadow-2xl">
        <div className="mb-6 flex items-center justify-between gap-4">
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

        <form onSubmit={onSubmit} className="space-y-5">
          {children}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
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

export default function Admin() {
  const { user, logout } = useAuth();
  const { confirm, showError, showSuccess } = useGeneralAlert();
  const shouldReduceMotion = useReducedMotion();

  const [activeTab, setActiveTab] = useState<AdminTab>("usuarios");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const [categoriaModalOpen, setCategoriaModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [categoriaForm, setCategoriaForm] = useState<CategoriaPayload>(emptyCategoriaForm);

  const [usuarioModalOpen, setUsuarioModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [usuarioForm, setUsuarioForm] = useState<UsuarioPayload>(emptyUsuarioForm);

  const loadAdminData = async () => {
    try {
      const data = await fetchAdminData();

      setUsuarios(data.usuarios);
      setCategorias(data.categorias);
      setRoles(data.roles);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo cargar la administracion";

      showError(message);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    fetchAdminData()
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setUsuarios(data.usuarios);
        setCategorias(data.categorias);
        setRoles(data.roles);
      })
      .catch((err: unknown) => {
        if (!isMounted) {
          return;
        }

        const message =
          err instanceof Error ? err.message : "No se pudo cargar la administracion";

        showError(message);
      })
      .finally(() => {
        if (isMounted) {
          setLoadingData(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [showError]);

  const openCreateCategoriaModal = () => {
    setSelectedCategoria(null);
    setCategoriaForm(emptyCategoriaForm);
    setCategoriaModalOpen(true);
  };

  const openEditCategoriaModal = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setCategoriaForm({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion ?? "",
    });
    setCategoriaModalOpen(true);
  };

  const openEditUsuarioModal = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setUsuarioForm({
      nombre: usuario.nombre,
      email: usuario.email,
      rol_id: usuario.rol_id,
    });
    setUsuarioModalOpen(true);
  };

  const openCreateUsuarioModal = () => {
    setSelectedUsuario(null);
    setUsuarioForm({
      ...emptyUsuarioForm,
      rol_id: roles[0]?.id ?? emptyUsuarioForm.rol_id,
    });
    setUsuarioModalOpen(true);
  };

  const closeCategoriaModal = () => {
    setCategoriaModalOpen(false);
    setSelectedCategoria(null);
    setCategoriaForm(emptyCategoriaForm);
  };

  const closeUsuarioModal = () => {
    setUsuarioModalOpen(false);
    setSelectedUsuario(null);
    setUsuarioForm(emptyUsuarioForm);
  };

  const getRoleDescription = (roleId: number) => {
    return roles.find((role) => role.id === roleId)?.descripcion ?? `Rol ${roleId}`;
  };

  const handleCategoriaSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    const payload: CategoriaPayload = {
      nombre: categoriaForm.nombre.trim(),
      descripcion: categoriaForm.descripcion?.trim() || null,
    };

    try {
      if (selectedCategoria) {
        await CategoriaInstance.updateCategoria(selectedCategoria.id, payload);
        showSuccess("Categoria actualizada correctamente.");
      } else {
        await CategoriaInstance.createCategoria(payload);
        showSuccess("Categoria creada correctamente.");
      }

      closeCategoriaModal();
      await loadAdminData();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo guardar la categoria";

      showError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleUsuarioSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

      closeUsuarioModal();
      await loadAdminData();
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

      await loadAdminData();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo cambiar el estado del usuario";

      showError(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const usuarioColumns: AdminTableColumn<Usuario>[] = [
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
            onClick={() => openEditUsuarioModal(usuario)}
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

  const categoriaColumns: AdminTableColumn<Categoria>[] = [
    {
      key: "nombre",
      header: "Nombre",
      render: (categoria) => (
        <p className="font-black text-stone-900">{categoria.nombre}</p>
      ),
    },
    {
      key: "descripcion",
      header: "Descripcion",
      render: (categoria) => categoria.descripcion || "Sin descripcion",
    },
    {
      key: "estado",
      header: "Estado",
      render: (categoria) => (
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
          {categoria.activo === false ? "Inactiva" : "Activa"}
        </span>
      ),
    },
    {
      key: "acciones",
      header: "Acciones",
      className: "text-right",
      render: (categoria) => (
        <button
          type="button"
          onClick={() => openEditCategoriaModal(categoria)}
          className="rounded-lg p-2 text-orange-700 transition hover:bg-orange-50"
          aria-label={`Editar ${categoria.nombre}`}
        >
          <Pencil size={18} />
        </button>
      ),
    },
  ];

  const activeTitle = activeTab === "usuarios" ? "Usuarios" : "Categorias";

  const handleLogout = async () => {
    const shouldLogout = await confirm({
      title: "Cerrar sesion",
      message: "Estas seguro de que quieres cerrar sesion?",
      confirmText: "Si, cerrar",
      cancelText: "Seguir aqui",
      variant: "warning",
    });

    if (shouldLogout) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf4]">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="text-left">
            <p className="text-sm font-bold text-orange-600">
              Panel de administracion
            </p>
            <h1 className="mt-1 font-serif text-4xl font-black leading-tight text-[#240800] lg:text-[44px]">
              Administracion
            </h1>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-orange-100 bg-white px-4 py-3 shadow-sm lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <UserRound size={20} />
            </span>
            <p className="font-bold text-[#240800]">{user?.nombre ?? "Admin"}</p>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="ml-auto rounded-lg p-2 text-orange-600 transition hover:bg-orange-50"
              aria-label="Cerrar sesion"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
          <aside className="h-fit rounded-lg border border-orange-100 bg-white p-1.5 shadow-sm">
            <nav className="grid gap-1">
              {adminTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = tab.key === activeTab;
                const isEnabled = tab.key === "usuarios" || tab.key === "categorias";

                return (
                  <motion.button
                    key={tab.key}
                    type="button"
                    disabled={!isEnabled}
                    onClick={() => {
                      if (isEnabled) {
                        setActiveTab(tab.key);
                      }
                    }}
                    className={`relative flex items-center gap-3 overflow-hidden rounded-lg px-3.5 py-2.5 text-left text-sm font-bold transition ${
                      isActive
                        ? "text-white"
                        : isEnabled
                          ? "text-stone-600 hover:bg-orange-50 hover:text-orange-600"
                          : "cursor-not-allowed text-stone-300"
                    }`}
                    whileHover={isEnabled && !shouldReduceMotion ? { x: 2 } : undefined}
                    whileTap={isEnabled && !shouldReduceMotion ? { scale: 0.98 } : undefined}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="admin-active-tab"
                        className="absolute inset-0 rounded-lg bg-orange-500 shadow-sm"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 34,
                        }}
                      />
                    )}
                    <Icon size={18} className="relative z-10" />
                    <span className="relative z-10">{tab.name}</span>
                  </motion.button>
                );
              })}
            </nav>
          </aside>

          <section>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-[#240800]">
                      {activeTitle}
                    </h2>
                    <p className="mt-2 text-sm font-medium text-stone-500">
                      {activeTab === "usuarios"
                        ? "Administra accesos, roles y estados de usuarios."
                        : "Crea y actualiza las categorias visibles del menu."}
                    </p>
                  </div>

                  {activeTab === "usuarios" && (
                    <motion.button
                      type="button"
                      onClick={openCreateUsuarioModal}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
                      whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                    >
                      <Plus size={18} />
                      Nuevo usuario
                    </motion.button>
                  )}

                  {activeTab === "categorias" && (
                    <motion.button
                      type="button"
                      onClick={openCreateCategoriaModal}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
                      whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                    >
                      <Plus size={18} />
                      Nueva categoria
                    </motion.button>
                  )}
                </div>

                {loadingData ? (
                  <div className="flex min-h-64 items-center justify-center rounded-lg border border-orange-100 bg-white">
                    <Loader2 size={28} className="animate-spin text-orange-500" />
                  </div>
                ) : activeTab === "usuarios" ? (
                  <AdminTable
                    columns={usuarioColumns}
                    data={usuarios}
                    emptyMessage="No hay usuarios registrados."
                    getRowKey={(usuario) => usuario.id}
                  />
                ) : (
                  <AdminTable
                    columns={categoriaColumns}
                    data={categorias}
                    emptyMessage="No hay categorias registradas."
                    getRowKey={(categoria) => categoria.id}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
      </main>

      {categoriaModalOpen && (
        <AdminModal
          title={selectedCategoria ? "Editar categoria" : "Nueva categoria"}
          submitLabel={selectedCategoria ? "Actualizar categoria" : "Crear categoria"}
          loading={saving}
          onClose={closeCategoriaModal}
          onSubmit={handleCategoriaSubmit}
        >
          <div>
            <label className="block text-sm font-bold text-stone-700">Nombre</label>
            <input
              type="text"
              value={categoriaForm.nombre}
              onChange={(event) =>
                setCategoriaForm((current) => ({
                  ...current,
                  nombre: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              placeholder="Ej: Bebidas"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700">
              Descripcion
            </label>
            <textarea
              value={categoriaForm.descripcion ?? ""}
              onChange={(event) =>
                setCategoriaForm((current) => ({
                  ...current,
                  descripcion: event.target.value,
                }))
              }
              className="mt-2 min-h-28 w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              placeholder="Descripcion opcional"
            />
          </div>
        </AdminModal>
      )}

      {usuarioModalOpen && (
        <AdminModal
          title={selectedUsuario ? "Editar usuario" : "Nuevo usuario"}
          submitLabel={selectedUsuario ? "Actualizar usuario" : "Crear usuario"}
          loading={saving}
          onClose={closeUsuarioModal}
          onSubmit={handleUsuarioSubmit}
        >
          <div>
            <label className="block text-sm font-bold text-stone-700">Nombre</label>
            <input
              type="text"
              value={usuarioForm.nombre}
              onChange={(event) =>
                setUsuarioForm((current) => ({
                  ...current,
                  nombre: event.target.value,
                }))
              }
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
              onChange={(event) =>
                setUsuarioForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700">Rol</label>
            <select
              value={usuarioForm.rol_id}
              onChange={(event) =>
                setUsuarioForm((current) => ({
                  ...current,
                  rol_id: Number(event.target.value),
                }))
              }
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

          {!selectedUsuario && (
            <div>
              <label className="block text-sm font-bold text-stone-700">
                Contrasena
              </label>
              <input
                type="password"
                value={usuarioForm.password ?? ""}
                onChange={(event) =>
                  setUsuarioForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                placeholder="Minimo 6 caracteres"
                minLength={6}
                required
              />
            </div>
          )}
        </AdminModal>
      )}
    </div>
  );
}
