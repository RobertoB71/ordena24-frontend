import { categories } from "./homeData";

export default function CategoriesSection() {
  return (
    <section className="bg-[#fffaf4] py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-4xl font-black text-[#240800]">
          Categorías
        </h2>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
          {categories.map((category) => (
            <button
              key={category.name}
              type="button"
              className="flex h-24 flex-col items-center justify-center gap-3 rounded-lg border border-orange-100 bg-white px-4 text-sm font-medium text-stone-700 transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100"
            >
              <span className="text-2xl" aria-hidden="true">
                {category.icon}
              </span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
