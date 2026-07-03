import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-2xl font-bold text-orange-600">
          Ordena24
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm font-medium text-gray-700">
            Inicio
          </Link>

          {!user ? (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Iniciar sesión
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
              >
                Registrarse
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-600">
                Hola, {user.nombre}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}