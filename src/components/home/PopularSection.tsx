import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { popularProducts } from "./homeData";

export default function PopularSection() {
  return (
    <section id="menu" className="bg-[#fff7ed] py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-left">
            <p className="text-sm font-bold text-orange-600">
              Selección del chef
            </p>
            <h2 className="mt-2 font-serif text-4xl font-black text-[#240800]">
              Más populares
            </h2>
          </div>

          <a
            href="#menu"
            className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 transition hover:text-orange-700"
          >
            Ver todos
            <ArrowRight size={17} />
          </a>
        </div>

        <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
