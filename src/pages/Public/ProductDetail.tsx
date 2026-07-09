import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/navbar/Navbar";
import { resolveImageUrl } from "../../components/menu/cards/productImage";
import { CategoriaInstance } from "../../services/Categorias/categoriaService";
import { PedidoInstance } from "../../services/Pedidos/pedidoService";
import { ProductoInstance } from "../../services/Productos/productoService";
import { useGeneralAlert } from "../../components/Alerts/GeneralAlerts/useGeneralAlert";
import { useAuth } from "../../hooks/Auth/useAuth";
import type { Categoria } from "../../models/categoria";
import type { Producto } from "../../models/producto";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(price);

const buildCategoryMap = (categories: Categoria[]) =>
  categories.reduce<Record<number, string>>((acc, category) => {
    acc[category.id] = category.descripcion;
    return acc;
  }, {});

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showAlert, showError, showSuccess } = useGeneralAlert();

  const [product, setProduct] = useState<Producto | null>(null);
  const [products, setProducts] = useState<Producto[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);

  const categoryMap = useMemo(() => buildCategoryMap(categories), [categories]);
  const productId = Number(id);

  useEffect(() => {
    if (!Number.isFinite(productId)) {
      navigate("/menu", { replace: true });
      return;
    }

    const loadProduct = async () => {
      try {
        const [productResponse, productsResponse, categoriesResponse] =
          await Promise.all([
            ProductoInstance.getProductoById(productId),
            ProductoInstance.getProductos(),
            CategoriaInstance.getCategoriasActivas(),
          ]);

        setProduct(productResponse.data);
        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "No se pudo cargar el producto";

        showError(message);
        navigate("/menu", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    void loadProduct();
  }, [navigate, productId, showError]);

  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    return products
      .filter(
        (item) =>
          item.disponible &&
          item.id !== product.id &&
          item.categoria_id === product.categoria_id,
      )
      .slice(0, 3);
  }, [product, products]);

  const handleAuthRequired = () => {
    showAlert({
      title: "Inicia sesión",
      message: "Debes iniciar sesión para realizar un pedido.",
      variant: "warning",
    });
    navigate("/login");
  };

  const handleOrder = async () => {
    if (!product) {
      return;
    }

    if (!user) {
      handleAuthRequired();
      return;
    }

    setOrdering(true);

    try {
      await PedidoInstance.createPedido({
        cliente_nombre: user.nombre,
        cliente_email: user.email,
        direccion_entrega: "Por confirmar",
        total: product.precio,
        estado: "pendiente",
        detalle: [
          {
            producto_id: product.id,
            nombre_producto: product.nombre,
            cantidad: 1,
            precio_unitario: product.precio,
            subtotal: product.precio,
          },
        ],
      });

      showSuccess(`${product.nombre} agregado como pedido.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo realizar el pedido";

      showError(message);
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffaf4]">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="h-[30rem] animate-pulse rounded-lg bg-white" />
        </main>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const categoryName = categoryMap[product.categoria_id] ?? "Menú";

  return (
    <div className="min-h-screen bg-[#fffaf4]">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 text-left sm:px-6 lg:px-8">
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#8a2f05] transition hover:text-orange-600"
        >
          <ArrowLeft size={17} />
          Volver al menú
        </Link>

        <section className="mt-8 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="overflow-hidden rounded-lg bg-orange-50 shadow-sm">
            <img
              src={resolveImageUrl(product.imagen_url)}
              alt={product.nombre}
              className="aspect-[1.12/1] w-full object-cover"
            />
          </div>

          <div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-600">
                <Tag size={14} />
                {categoryName}
              </span>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${
                  product.disponible
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                <CheckCircle2 size={14} />
                {product.disponible ? "Disponible" : "No disponible"}
              </span>
            </div>

            <h1 className="mt-5 font-serif text-4xl font-black leading-tight text-[#240800] sm:text-5xl">
              {product.nombre}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#8a2f05]">
              {product.descripcion || "Producto preparado al momento."}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <strong className="text-4xl font-black text-[#240800]">
                {formatPrice(product.precio)}
              </strong>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#8a2f05]">
                <Clock3 size={17} />
                20-35 min
              </span>
            </div>

            <button
              type="button"
              onClick={() => void handleOrder()}
              disabled={!product.disponible || ordering}
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {user ? <ShoppingBag size={18} /> : <LockKeyhole size={18} />}
              {ordering
                ? "Enviando pedido..."
                : user
                  ? "Realizar pedido"
                  : "Inicia sesión para pedir"}
            </button>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-3xl font-black text-[#240800]">
              También te puede gustar
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  to={`/menu/${item.id}`}
                  className="overflow-hidden rounded-lg border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100"
                >
                  <img
                    src={resolveImageUrl(item.imagen_url)}
                    alt={item.nombre}
                    className="aspect-[4/2.25] w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <h3 className="font-black text-[#240800]">{item.nombre}</h3>
                    <p className="mt-2 text-sm font-black text-orange-600">
                      {formatPrice(item.precio)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
