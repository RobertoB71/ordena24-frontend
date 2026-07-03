import { ChefHat, LogOut, Menu, ShoppingBag, UserPlus } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-orange-100 bg-[#fffaf4]/95 backdrop-blur">
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
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-semibold transition ${
                isActive
                  ? "text-orange-600"
                  : "text-stone-600 hover:text-orange-600"
              }`
            }
          >
            Inicio
          </NavLink>
          <a
            href="#menu"
            className="text-sm font-semibold text-stone-600 transition hover:text-orange-600"
          >
            Menú
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-stone-600 transition hover:bg-orange-50 hover:text-orange-600 md:hidden"
            aria-label="Ir al menú"
            title="Menú"
          >
            <Menu size={21} />
          </Link>

          {!user ? (
            <>
              <Link
                to="/login"
                className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-stone-600 transition hover:bg-orange-50 hover:text-orange-600 sm:inline-flex"
              >
                Iniciar sesión
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
              >
                <UserPlus size={17} />
                Registrarse
              </Link>
            </>
          ) : (
            <>
              <span className="hidden items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-stone-700 sm:inline-flex">
                <ShoppingBag size={17} className="text-orange-500" />
                Hola, {user.nombre}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-stone-800"
              >
                <LogOut size={17} />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
