import { useState } from "react";
import { ChefHat, LockKeyhole, Mail, Sparkles, UserRound } from "lucide-react";
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
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_right,#fed7aa,transparent_32%),linear-gradient(135deg,#ffffff_0%,#fff7ed_52%,#fffbeb_100%)] px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-2xl shadow-orange-100 md:grid-cols-[1.05fr_1fr]">
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
            <h1 className="mt-8 text-3xl font-black text-stone-900">
              Crea tu cuenta
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              Regístrate para pedir tus platos favoritos en menos tiempo.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-stone-700">
                Nombre completo
              </label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50/60 px-4 py-3 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
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
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50/60 px-4 py-3 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
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
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-orange-500 px-5 py-3 font-bold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
            >
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

          <p className="mt-3 text-center text-sm">
            <Link
              to="/"
              className="font-medium text-stone-400 hover:text-stone-600"
            >
              Volver al inicio
            </Link>
          </p>
        </div>

        <aside className="relative hidden bg-stone-900 p-10 text-left text-white md:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(251,146,60,0.45),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.1),transparent_42%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <span className="inline-flex rounded-full bg-orange-400/20 px-4 py-2 text-sm font-bold text-orange-100">
                Nuevos sabores cada día
              </span>
              <h2 className="mt-8 text-4xl font-black leading-tight text-white">
                Ordena fácil, recoge rápido, disfruta caliente.
              </h2>
              <p className="mt-4 max-w-sm text-base leading-7 text-stone-200">
                Guarda tus datos una vez y acelera cada pedido desde tu cuenta.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <Sparkles size={20} className="text-orange-300" />
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
