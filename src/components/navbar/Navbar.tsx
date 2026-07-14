import {
  ChefHat,
  ClipboardList,
  LogOut,
  Menu,
  X,
  ReceiptText,
  ShoppingBag,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useGeneralAlert } from "../Alerts/GeneralAlerts/useGeneralAlert";
import { useAuth } from "../../hooks/Auth/useAuth";
import { useCart } from "../../context/CartContext";
import { RoleId } from "../../security/permissions";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { confirm } = useGeneralAlert();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = user?.rol_id === RoleId.Admin;
  const isWorker = user?.rol_id === RoleId.Trabajador || isAdmin;
  const canSeeOwnOrders = Boolean(user) && user?.rol_id !== RoleId.Trabajador;
  const canSeeCart = canSeeOwnOrders;

  const handleLogout = async () => {
    const shouldLogout = await confirm({
      title: "Cerrar sesion",
      message: "Estas seguro de que quieres cerrar sesion?",
      confirmText: "Si, cerrar",
      cancelText: "Seguir aqui",
      variant: "warning",
    });

    if (!shouldLogout) {
      return;
    }

    logout();
    navigate("/");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition ${
      isActive ? "text-orange-600" : "text-stone-600 hover:text-orange-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-orange-100 bg-[#fffaf4]/95 shadow-sm shadow-orange-950/5 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm">
            <ChefHat size={20} strokeWidth={2.4} />
          </span>
          <span className="font-serif text-2xl font-black leading-none text-[#240800]">
            Ordena<span className="text-orange-500">24</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Inicio
          </NavLink>
          <NavLink to="/menu" className={navLinkClass}>
            Menu
          </NavLink>
          {isWorker && (
            <NavLink to="/worker/orders" className={navLinkClass}>
              Panel Trabajador
            </NavLink>
          )}
          {canSeeOwnOrders && (
            <NavLink to="/orders" className={navLinkClass}>
              Mis pedidos
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              Administracion
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-100 bg-white text-stone-700 transition hover:border-orange-300 hover:text-orange-600 md:hidden"
            aria-label={mobileOpen ? "Cerrar navegación" : "Abrir navegación"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>

          {!user ? (
            <>
              <Link
                to="/login"
                className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-stone-600 transition hover:bg-orange-50 hover:text-orange-600 sm:inline-flex"
              >
                Iniciar sesion
              </Link>

              <Link
                to="/register"
                className="hidden items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 md:inline-flex"
              >
                <UserPlus size={17} />
                Registrarse
              </Link>
            </>
          ) : (
            <>
              {canSeeCart && (
                <Link
                  to="/cart"
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-stone-600 transition hover:bg-orange-50 hover:text-orange-600"
                  aria-label="Ir al carrito"
                  title="Carrito"
                >
                  <ShoppingBag size={20} />
                  {itemCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[11px] font-black text-white">
                      {itemCount}
                    </span>
                  )}
                </Link>
              )}

              {canSeeOwnOrders && (
                <Link
                  to="/orders"
                  className="hidden h-10 w-10 items-center justify-center rounded-lg text-stone-600 transition hover:bg-orange-50 hover:text-orange-600 sm:inline-flex"
                  aria-label="Ver mis pedidos"
                  title="Mis pedidos"
                >
                  <ReceiptText size={20} />
                </Link>
              )}

              {isWorker && (
                <Link
                  to="/worker/orders"
                  className="hidden h-10 w-10 items-center justify-center rounded-lg text-stone-600 transition hover:bg-orange-50 hover:text-orange-600 sm:inline-flex"
                  aria-label="Panel trabajador"
                  title="Panel trabajador"
                >
                  <ClipboardList size={20} />
                </Link>
              )}

              <span className="hidden items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-stone-700 lg:inline-flex">
                <ShoppingBag size={17} className="text-orange-500" />
                Hola, {user.nombre}
              </span>

              <button
                type="button"
                onClick={() => void handleLogout()}
                className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-stone-800"
              >
                <LogOut size={17} />
                <span className="hidden sm:inline">Cerrar sesion</span>
              </button>
            </>
          )}
        </div>
      </nav>
      {mobileOpen && (
        <div id="mobile-navigation" onClick={() => setMobileOpen(false)} className="border-t border-orange-100 bg-[#fffaf4] px-4 py-4 shadow-xl md:hidden">
          <div className="mx-auto grid max-w-7xl gap-1">
            <NavLink to="/" className={({ isActive }) => `rounded-xl px-4 py-3 text-sm font-bold ${isActive ? "bg-orange-100 text-orange-700" : "text-stone-700 hover:bg-orange-50"}`}>Inicio</NavLink>
            <NavLink to="/menu" className={({ isActive }) => `rounded-xl px-4 py-3 text-sm font-bold ${isActive ? "bg-orange-100 text-orange-700" : "text-stone-700 hover:bg-orange-50"}`}>Menú</NavLink>
            {canSeeOwnOrders && <NavLink to="/orders" className={({ isActive }) => `rounded-xl px-4 py-3 text-sm font-bold ${isActive ? "bg-orange-100 text-orange-700" : "text-stone-700 hover:bg-orange-50"}`}>Mis pedidos</NavLink>}
            {isWorker && <NavLink to="/worker/orders" className={({ isActive }) => `rounded-xl px-4 py-3 text-sm font-bold ${isActive ? "bg-orange-100 text-orange-700" : "text-stone-700 hover:bg-orange-50"}`}>Panel trabajador</NavLink>}
            {isAdmin && <NavLink to="/admin" className={({ isActive }) => `rounded-xl px-4 py-3 text-sm font-bold ${isActive ? "bg-orange-100 text-orange-700" : "text-stone-700 hover:bg-orange-50"}`}>Administración</NavLink>}
            {!user && (
              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-orange-100 pt-4">
                <Link to="/login" className="rounded-xl border border-orange-200 bg-white px-4 py-3 text-center text-sm font-bold text-orange-700">Iniciar sesión</Link>
                <Link to="/register" className="rounded-xl bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white">Registrarse</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
