import Navbar from "../../components/navbar/Navbar";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-16">
        <section className="rounded-3xl bg-white p-10 shadow-sm">
          <p className="text-sm font-semibold uppercase text-orange-600">
            Delivery de comida
          </p>

          <h1 className="mt-4 text-5xl font-bold text-gray-900">
            Bienvenido a Ordena24
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Explora nuestro menú, revisa los productos disponibles y realiza
            pedidos de comida de forma rápida.
          </p>

          {user ? (
            <p className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-green-700">
              Sesión iniciada como {user.nombre}
            </p>
          ) : (
            <p className="mt-6 rounded-xl bg-orange-100 px-4 py-3 text-orange-700">
              Puedes ver el menú como visitante. Para realizar pedidos debes
              iniciar sesión o registrarte.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}