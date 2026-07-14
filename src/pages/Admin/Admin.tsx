import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  LogOut,
  Package,
  Tags,
  UserRound,
  Users,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useGeneralAlert } from "../../components/Alerts/GeneralAlerts/useGeneralAlert";
import Navbar from "../../components/navbar/Navbar";
import { useAuth } from "../../hooks/Auth/useAuth";
import type { Categoria } from "../../models/categoria";
import type { Producto } from "../../models/producto";
import type { Rol, Usuario } from "../../models/usuario";
import { CategoriaInstance } from "../../services/Categorias/categoriaService";
import { ProductoInstance } from "../../services/Productos/productoService";
import { UsuarioInstance } from "../../services/Usuarios/usuarioService";
import CategoriasTab from "../../components/admin/Tabs/CategoriasTab";
import ProductosTab from "../../components/admin/Tabs/ProductosTab";
import UsuariosTab from "../../components/admin/Tabs/UsuariosTab";

type AdminTab = "usuarios" | "productos" | "categorias";

const adminTabs = [
  { key: "usuarios", name: "Usuarios", icon: Users },
  { key: "productos", name: "Productos", icon: Package },
  { key: "categorias", name: "Categorias", icon: Tags },
] as const;

const tabRoutes: Record<AdminTab, string> = {
  usuarios: "/admin",
  productos: "/admin/products",
  categorias: "/admin/categories",
};

const getTabFromPath = (pathname: string): AdminTab => {
  if (pathname.includes("/admin/products")) {
    return "productos";
  }

  if (pathname.includes("/admin/categories")) {
    return "categorias";
  }

  return "usuarios";
};

const fetchAdminData = async () => {
  const [usuariosResponse, categoriasResponse, rolesResponse, productosResponse] = await Promise.all([
    UsuarioInstance.getUsuarios(),
    CategoriaInstance.getCategorias(),
    UsuarioInstance.getRoles(),
    ProductoInstance.getProductos(),
  ]);

  return {
    usuarios: usuariosResponse.data,
    categorias: categoriasResponse.data,
    roles: rolesResponse.data,
    productos: productosResponse.data,
  };
};

export default function Admin() {
  const { user, logout } = useAuth();
  const { confirm, showError } = useGeneralAlert();
  const shouldReduceMotion = useReducedMotion();
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = getTabFromPath(location.pathname);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const loadAdminData = async () => {
    try {
      const data = await fetchAdminData();

      setUsuarios(data.usuarios);
      setCategorias(data.categorias);
      setProductos(data.productos);
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
        setProductos(data.productos);
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

      <main className="mx-auto w-full max-w-6xl overflow-hidden px-3 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="text-left">
            <p className="text-sm font-bold text-orange-600">
              Panel de administracion
            </p>
            <h1 className="mt-1 font-serif text-3xl font-black leading-tight text-[#240800] sm:text-4xl lg:text-[44px]">
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

        <div className="grid min-w-0 gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
          <aside className="h-fit rounded-lg border border-orange-100 bg-white p-1.5 shadow-sm">
            <nav className="grid grid-cols-3 gap-1 lg:grid-cols-1">
              {adminTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = tab.key === activeTab;
                const isEnabled =
                  tab.key === "usuarios" ||
                  tab.key === "productos" ||
                  tab.key === "categorias";

                return (
                  <motion.button
                    key={tab.key}
                    type="button"
                    disabled={!isEnabled}
                    onClick={() => {
                      if (isEnabled) {
                        const nextTab = tab.key as AdminTab;

                        navigate(tabRoutes[nextTab]);
                      }
                    }}
                    className={`relative flex min-w-0 flex-col items-center gap-1.5 overflow-hidden rounded-lg px-2 py-2.5 text-center text-xs font-bold transition sm:flex-row sm:gap-3 sm:px-3.5 sm:text-left sm:text-sm lg:flex-row ${
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

          <section className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {activeTab === "usuarios" ? (
                  <UsuariosTab
                    usuarios={usuarios}
                    roles={roles}
                    loadingData={loadingData}
                    onDataChanged={loadAdminData}
                  />
                ) : activeTab === "productos" ? (
                  <ProductosTab
                    productos={productos}
                    categorias={categorias}
                    loadingData={loadingData}
                    onDataChanged={loadAdminData}
                  />
                ) : (
                  <CategoriasTab
                    categorias={categorias}
                    loadingData={loadingData}
                    onDataChanged={loadAdminData}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
      </main>
    </div>
  );
}
