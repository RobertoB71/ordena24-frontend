import { useState } from "react";
import {
  ArrowLeft,
  ChefHat,
  LockKeyhole,
  LogIn,
  Mail,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { AuthInstance } from "../../services/Auth/authService";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await AuthInstance.login({
        email,
        password,
      });

      login(response.data);
      navigate("/", { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al iniciar sesión";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffaf4]">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <aside className="hidden rounded-lg bg-orange-600 p-8 text-left text-white lg:flex">
          <div className="flex h-full flex-col justify-between">
            <div>
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-white/15 text-white">
                <ChefHat size={30} />
              </span>
              <h1 className="mt-8 max-w-md text-4xl font-black leading-tight text-white">
                Tu mesa favorita, lista cuando llegues.
              </h1>
              <p className="mt-4 max-w-md text-base leading-7 text-orange-50">
                Entra a Ordena24 y continúa con tus pedidos, sabores guardados
                y experiencias del restaurante.
              </p>
            </div>

            <div className="rounded-lg border border-white/20 bg-white/15 p-5">
              <div className="flex items-center gap-3">
                <Sparkles size={20} className="text-white" />
                <p className="text-sm font-semibold text-white">
                  Cocina cálida, servicio rápido y pedidos sin espera.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex items-center justify-center py-8 lg:py-0">
          <div className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 text-left shadow-xl shadow-stone-200/70 sm:p-8">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-stone-500 transition hover:text-orange-600"
            >
              <ArrowLeft size={17} />
              Volver al inicio
            </Link>

            <div className="mb-8">
              <Link to="/" className="inline-flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500 text-white shadow-sm">
                  <ChefHat size={24} />
                </span>
                <span className="text-2xl font-black text-stone-900">
                  Ordena<span className="text-orange-500">24</span>
                </span>
              </Link>
              <h2 className="mt-8 text-3xl font-black text-stone-950">
                Bienvenido de nuevo
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Inicia sesión para realizar pedidos y revisar tu cuenta.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-stone-700">
                  Correo electrónico
                </label>
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
                  <Mail size={20} className="shrink-0 text-orange-500" />
                  <input
                    type="email"
                    className="w-full bg-transparent text-sm font-medium text-stone-800 outline-none placeholder:text-stone-400"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700">
                  Contraseña
                </label>
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
                  <LockKeyhole size={20} className="shrink-0 text-orange-500" />
                  <input
                    type="password"
                    className="w-full bg-transparent text-sm font-medium text-stone-800 outline-none placeholder:text-stone-400"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="********"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogIn size={18} />
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-stone-500">
              ¿No tienes cuenta?{" "}
              <Link
                to="/register"
                className="font-bold text-orange-600 hover:text-orange-700"
              >
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
