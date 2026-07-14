import { Link } from "react-router-dom";

type HomeCtaProps = {
  isAuthenticated: boolean;
};

export default function HomeCta({ isAuthenticated }: HomeCtaProps) {
  return (
    <section className="bg-[#fffaf4] py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="font-serif text-4xl font-black text-[#240800] sm:text-5xl">
          ¿Listo para pedir?
        </h2>
        <p className="mt-4 text-lg text-[#8a2f05]">
          Crea una cuenta gratis y disfruta de tu comida favorita en la
          comodidad de tu hogar.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/menu"
            className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-7 py-4 text-base font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
          >
            Ver Menú Completo
          </Link>

          {!isAuthenticated && (
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-lg border border-stone-300 bg-white px-7 py-4 text-base font-bold text-[#240800] transition hover:border-orange-300 hover:text-orange-600"
            >
              Crear Cuenta Gratis
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
