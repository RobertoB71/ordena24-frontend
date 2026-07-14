import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Producto } from "../../models/producto";
import { resolveImageUrl } from "../menu/cards/productImage";

type ProductCardProps = {
  product: Producto;
  categoryName: string;
};

const priceFormatter = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

export default function ProductCard({ product, categoryName }: ProductCardProps) {
  return (
    <Link to={`/menu/${product.id}`} className="group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-200/60">
      <article>
        <div className="relative h-56 overflow-hidden bg-orange-50">
          <img src={resolveImageUrl(product.imagen_url)} alt={product.nombre} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
          <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-sm font-black text-[#240800] shadow-sm backdrop-blur">{priceFormatter.format(product.precio)}</span>
        </div>
        <div className="p-5 text-left">
          <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">{categoryName}</span>
          <div className="mt-4 flex items-start justify-between gap-3">
            <h3 className="text-xl font-black text-[#240800]">{product.nombre}</h3>
            <ArrowUpRight size={20} className="shrink-0 text-orange-500 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-[#8a2f05]">{product.descripcion || "Producto fresco preparado al momento."}</p>
        </div>
      </article>
    </Link>
  );
}
