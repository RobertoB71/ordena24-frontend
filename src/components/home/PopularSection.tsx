import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Categoria } from "../../models/categoria";
import type { Producto } from "../../models/producto";
import ProductCard from "./ProductCard";

type PopularSectionProps = {
  products: Producto[];
  categories: Categoria[];
  loading: boolean;
};

export default function PopularSection({ products, categories, loading }: PopularSectionProps) {
  const categoryNames = new Map(categories.map((category) => [category.id, category.descripcion]));

  return (
    <section id="menu" className="bg-[#fff7ed] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-left">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-orange-600">Selección del chef</p>
            <h2 className="mt-2 font-serif text-4xl font-black text-[#240800] sm:text-5xl">Más populares</h2>
          </div>
          <Link to="/menu" className="inline-flex items-center gap-2 font-bold text-orange-600 transition hover:gap-3 hover:text-orange-700">
            Ver todos <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading && Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-2xl border border-orange-100 bg-white" />
          ))}
          {!loading && products.map((product) => (
            <ProductCard key={product.id} product={product} categoryName={categoryNames.get(product.categoria_id) ?? "Menú"} />
          ))}
        </div>

        {!loading && products.length === 0 && (
          <p className="mt-8 rounded-xl border border-dashed border-orange-200 bg-white p-6 text-center text-sm text-stone-500">No hay productos disponibles en este momento.</p>
        )}
      </div>
    </section>
  );
}
