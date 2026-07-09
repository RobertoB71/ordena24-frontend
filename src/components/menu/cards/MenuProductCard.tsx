import { LockKeyhole, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

import type { Producto } from "../../../models/producto";
import { resolveImageUrl } from "./productImage";

type MenuProductCardProps = {
  product: Producto;
  categoryName: string;
  isAuthenticated: boolean;
  onAuthRequired: () => void;
  onOrder: (product: Producto) => void;
};

export default function MenuProductCard({
  product,
  categoryName,
  isAuthenticated,
  onAuthRequired,
  onOrder,
}: MenuProductCardProps) {
  const price = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(product.precio);

  return (
    <article className="group overflow-hidden rounded-lg border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100">
      <Link to={`/menu/${product.id}`} className="block">
        <div className="relative aspect-[4/2.45] overflow-hidden bg-orange-50">
          <img
            src={resolveImageUrl(product.imagen_url)}
            alt={product.nombre}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute left-3 top-3 rounded-lg bg-white px-3 py-1 text-xs font-black text-orange-600 shadow-sm">
            {categoryName}
          </span>
        </div>

        <div className="p-4 text-left">
          <h2 className="text-xl font-black leading-tight text-[#240800]">
            {product.nombre}
          </h2>
          <p className="mt-2 line-clamp-2 min-h-[3rem] text-sm leading-6 text-[#8a2f05]">
            {product.descripcion || "Producto preparado al momento."}
          </p>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-3 px-4 pb-4">
        <strong className="text-lg font-black text-[#240800]">{price}</strong>
        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated) {
              onAuthRequired();
              return;
            }

            onOrder(product);
          }}
          disabled={!product.disponible}
          className="inline-flex min-h-9 items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-xs font-black text-[#8a2f05] transition hover:border-orange-200 hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isAuthenticated ? <ShoppingBag size={15} /> : <LockKeyhole size={15} />}
          {product.disponible
            ? isAuthenticated
              ? "Pedir"
              : "Inicia sesión"
            : "No disponible"}
        </button>
      </div>
    </article>
  );
}
