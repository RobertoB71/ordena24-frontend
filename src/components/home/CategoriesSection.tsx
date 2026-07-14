import { Link } from "react-router-dom";
import type { Categoria } from "../../models/categoria";

type CategoriesSectionProps = {
  categories: Categoria[];
  loading: boolean;
};

const getCategoryEmoji = (description: string) => {
  const value = description.toLocaleLowerCase("es");
  if (value.includes("hamburg")) return "🍔";
  if (value.includes("pizza")) return "🍕";
  if (value.includes("pasta")) return "🍝";
  if (value.includes("ensalad")) return "🥗";
  if (value.includes("taco")) return "🌮";
  if (value.includes("postre") || value.includes("dulce")) return "🍰";
  if (value.includes("bebida") || value.includes("refresco")) return "🥤";
  if (value.includes("pollo")) return "🍗";
  if (value.includes("sushi")) return "🍣";
  if (value.includes("café") || value.includes("cafe")) return "☕";
  return "🍽️";
};

export default function CategoriesSection({ categories, loading }: CategoriesSectionProps) {
  return (
    <section className="bg-[#fffaf4] py-14 sm:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-4xl font-black text-[#240800] sm:text-5xl">Categorías</h2>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {loading && Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-xl border border-orange-100 bg-white" />
          ))}
          {!loading && categories.map((category) => (
            <Link
              key={category.id}
              to={`/menu?categoria=${category.id}`}
              className="group flex h-28 flex-col items-center justify-center gap-3 rounded-xl border border-orange-200/80 bg-white px-3 text-center text-sm font-semibold text-[#240800] transition duration-200 hover:-translate-y-1 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-100"
            >
              <span className="text-2xl transition duration-200 group-hover:scale-110" aria-hidden="true">
                {getCategoryEmoji(category.descripcion)}
              </span>
              <span className="line-clamp-2">{category.descripcion}</span>
            </Link>
          ))}
        </div>

        {!loading && categories.length === 0 && (
          <p className="mt-8 rounded-xl border border-dashed border-orange-200 bg-white p-6 text-center text-sm text-stone-500">No hay categorías disponibles en este momento.</p>
        )}
      </div>
    </section>
  );
}
