import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";

type HomeHeroProps = {
  isAuthenticated: boolean;
};

const avatarUrls = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=96&q=80",
];

export default function HomeHero({ isAuthenticated }: HomeHeroProps) {
  return (
    <section className="bg-[#fff9ef]">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
        <div className="text-left">
          <p className="inline-flex items-center gap-2 rounded-lg bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Entrega en 30-45 minutos
          </p>

          <h1 className="mt-7 max-w-3xl font-serif text-5xl font-black leading-[1.03] text-[#240800] sm:text-6xl lg:text-7xl">
            Comida <span className="text-orange-500">deliciosa</span> a tu
            puerta
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#8a2f05]">
            Elige entre nuestros platos favoritos, hechos con ingredientes
            frescos. Pedidos rápidos, entrega confiable.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#menu"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
            >
              Ver Menú
              <ArrowRight size={18} />
            </a>

            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-lg border border-orange-200 bg-white px-6 py-4 text-base font-bold text-orange-600 transition hover:border-orange-300 hover:bg-orange-50"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-lg bg-[#260900] px-6 py-4 text-base font-bold text-white transition hover:bg-[#3a1105]"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <div className="flex -space-x-3">
              {avatarUrls.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt=""
                  className="h-9 w-9 rounded-full border-2 border-[#fff9ef] object-cover"
                />
              ))}
            </div>
            <div>
              <p className="text-sm font-bold tracking-[0.08em] text-amber-400">
                ★★★★★
              </p>
              <p className="text-sm font-medium text-[#8a2f05]">
                +2,400 clientes satisfechos
              </p>
            </div>
          </div>
        </div>

        <div className="relative min-h-[420px] lg:min-h-[500px]">
          <img
            src="https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=1200&q=85"
            alt="Pizza artesanal recién preparada"
            className="h-[420px] w-full rounded-lg object-cover shadow-2xl shadow-orange-100 lg:h-[500px]"
          />

          <div className="absolute right-4 top-4 flex items-center gap-3 rounded-lg border border-orange-100 bg-white p-4 shadow-xl shadow-orange-100 sm:right-[-12px] sm:top-[-22px]">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck size={24} />
            </span>
            <div>
              <p className="text-xs font-medium text-[#8a2f05]">
                Calidad garantizada
              </p>
              <p className="font-black text-[#240800]">100% Fresco</p>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-lg border border-orange-100 bg-white p-4 shadow-xl shadow-orange-100 sm:bottom-[-22px] sm:left-[-22px]">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
              <Truck size={24} />
            </span>
            <div>
              <p className="text-xs font-medium text-[#8a2f05]">
                Tiempo estimado
              </p>
              <p className="font-black text-[#240800]">30-45 min</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
