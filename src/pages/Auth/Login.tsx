import { useState } from "react";
import { ChefHat, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { AuthInstance } from "../../services/Auth/authService";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@ordena24.com");
  const [password, setPassword] = useState("admin123");
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
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,#fed7aa,transparent_34%),linear-gradient(135deg,#fff7ed_0%,#fffbeb_48%,#ffffff_100%)] px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-2xl shadow-orange-100 md:grid-cols-[1fr_1.05fr]">
        <aside className="relative hidden bg-orange-500 p-10 text-left text-white md:block">
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.18),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.24),transparent_24%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                <ChefHat size={30} />
              </span>
              <h1 className="mt-8 text-4xl font-black leading-tight text-white">
                Tu mesa favorita, lista cuando llegues.
              </h1>
              <p className="mt-4 max-w-sm text-base leading-7 text-orange-50">
                Entra a Ordena24 y continúa con tus pedidos, sabores guardados y
                experiencias del restaurante.
              </p>
            </div>

            <div className="rounded-3xl bg-white/15 p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <Sparkles size={20} />
                <p className="text-sm font-semibold text-white">
                  Cocina cálida, servicio rápido y pedidos sin espera.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div className="p-6 text-left sm:p-10">
          <div className="mb-8 text-center md:text-left">
            <Link
              to="/"
              className="mx-auto inline-flex items-center gap-3 md:mx-0"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-200">
                <ChefHat size={24} />
              </span>
              <span className="text-2xl font-black tracking-tight text-stone-900">
                Ordena<span className="text-orange-500">24</span>
              </span>
            </Link>
            <h2 className="mt-8 text-3xl font-black text-stone-900">
              Bienvenido de nuevo
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              Inicia sesión para realizar pedidos y revisar tu cuenta.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-stone-700">
                Correo electrónico
              </label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50/60 px-4 py-3 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
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
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50/60 px-4 py-3 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
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
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-orange-500 px-5 py-3 font-bold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
            >
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

          <p className="mt-3 text-center text-sm">
            <Link
              to="/"
              className="font-medium text-stone-400 hover:text-stone-600"
            >
              Volver al inicio
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
