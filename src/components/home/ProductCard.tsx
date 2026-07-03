import { Clock3 } from "lucide-react";
import type { PopularProduct } from "./homeData";

type ProductCardProps = {
  product: PopularProduct;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
        <span className="absolute right-3 top-3 rounded-lg bg-white px-3 py-1 text-sm font-black text-[#240800] shadow-sm">
          {product.price}
        </span>
      </div>

      <div className="p-4 text-left">
        <span className="rounded-lg bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
          {product.category}
        </span>
        <h3 className="mt-4 text-xl font-black text-[#240800]">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#8a2f05]">
          {product.description}
        </p>
        <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#8a2f05]">
          <Clock3 size={16} />
          {product.time}
        </p>
      </div>
    </article>
  );
}
