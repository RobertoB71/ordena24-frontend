import { useState } from "react";
import {
  ArrowLeft,
  ChefHat,
  LockKeyhole,
  Mail,
  Sparkles,
  UserRound,
  UserPlus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { AuthInstance } from "../../services/Auth/authService";

export default function Register() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      await AuthInstance.register({
        nombre,
        email,
        password,
        rol_id: 1,
      });

      navigate("/login", { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al registrar usuario";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffaf4]">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
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
              <h1 className="mt-8 text-3xl font-black text-stone-950">
                Crea tu cuenta
              </h1>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Regístrate para pedir tus platos favoritos en menos tiempo.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-700">
                  Nombre completo
                </label>
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
                  <UserRound size={20} className="shrink-0 text-orange-500" />
                  <input
                    type="text"
                    className="w-full bg-transparent text-sm font-medium text-stone-800 outline-none placeholder:text-stone-400"
                    value={nombre}
                    onChange={(event) => setNombre(event.target.value)}
                    placeholder="Tu nombre"
                    required
                  />
                </div>
              </div>

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
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700">
                  Confirmar contraseña
                </label>
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
                  <LockKeyhole size={20} className="shrink-0 text-orange-500" />
                  <input
                    type="password"
                    className="w-full bg-transparent text-sm font-medium text-stone-800 outline-none placeholder:text-stone-400"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repite la contraseña"
                    minLength={6}
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
                <UserPlus size={18} />
                {loading ? "Creando cuenta..." : "Registrarme"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-stone-500">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                className="font-bold text-orange-600 hover:text-orange-700"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        <aside className="hidden rounded-lg bg-orange-600 p-8 text-left text-white lg:flex">
          <div className="flex h-full flex-col justify-between">
            <div>
              <span className="inline-flex rounded-lg bg-white/15 px-4 py-2 text-sm font-bold text-white">
                Nuevos sabores cada día
              </span>
              <h2 className="mt-8 max-w-md text-4xl font-black leading-tight text-white">
                Ordena fácil, recoge rápido, disfruta caliente.
              </h2>
              <p className="mt-4 max-w-md text-base leading-7 text-orange-50">
                Guarda tus datos una vez y acelera cada pedido desde tu cuenta.
              </p>
            </div>

            <div className="rounded-lg border border-white/20 bg-white/15 p-5">
              <div className="flex items-center gap-3">
                <Sparkles size={20} className="text-white" />
                <p className="text-sm font-semibold text-white">
                  Una experiencia suave para clientes con hambre real.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
