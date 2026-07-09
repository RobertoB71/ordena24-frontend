import { useEffect, useMemo, useState } from "react";
import { Search, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/navbar/Navbar";
import MenuProductCard from "../../components/menu/cards/MenuProductCard";
import { CategoriaInstance } from "../../services/Categorias/categoriaService";
import { PedidoInstance } from "../../services/Pedidos/pedidoService";
import { ProductoInstance } from "../../services/Productos/productoService";
import { useGeneralAlert } from "../../components/Alerts/GeneralAlerts/useGeneralAlert";
import { useAuth } from "../../hooks/Auth/useAuth";
import type { Categoria } from "../../models/categoria";
import type { Producto } from "../../models/producto";

const currencyFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

const buildCategoryMap = (categories: Categoria[]) =>
  categories.reduce<Record<number, string>>((acc, category) => {
    acc[category.id] = category.descripcion;
    return acc;
  }, {});

export default function Menu() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showError, showSuccess, showAlert } = useGeneralAlert();

  const [products, setProducts] = useState<Producto[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [orderingId, setOrderingId] = useState<number | null>(null);

  const isAuthenticated = Boolean(user);
  const categoryMap = useMemo(() => buildCategoryMap(categories), [categories]);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          ProductoInstance.getProductos(),
          CategoriaInstance.getCategoriasActivas(),
        ]);

        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "No se pudo cargar el menú";

        showError(message);
      } finally {
        setLoading(false);
      }
    };

    void loadMenu();
  }, [showError]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      if (!product.disponible) {
        return false;
      }

      const matchesCategory =
        selectedCategory === "all" || product.categoria_id === selectedCategory;
      const matchesSearch =
        !normalizedSearch ||
        product.nombre.toLowerCase().includes(normalizedSearch) ||
        (product.descripcion ?? "").toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleAuthRequired = () => {
    showAlert({
      title: "Inicia sesión",
      message: "Debes iniciar sesión para realizar un pedido.",
      variant: "warning",
    });
    navigate("/login");
  };

  const handleOrder = async (product: Producto) => {
    if (!user) {
      handleAuthRequired();
      return;
    }

    setOrderingId(product.id);

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
      setOrderingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf4]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-10 text-left sm:px-6 lg:px-8">
        <section className="max-w-3xl">
          <p className="text-sm font-black text-orange-600">Ordena24</p>
          <h1 className="mt-2 font-serif text-4xl font-black leading-tight text-[#240800] sm:text-5xl">
            Nuestro Menú
          </h1>
          <p className="mt-3 text-base font-medium text-[#8a2f05]">
            Ingredientes frescos, sabores auténticos
          </p>

          <div className="mt-8 flex max-w-lg items-center gap-3 rounded-lg border border-orange-100 bg-white px-4 py-3 shadow-sm focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-100">
            <Search size={20} className="shrink-0 text-[#8a2f05]" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar platos..."
              className="w-full bg-transparent text-sm font-medium text-stone-800 outline-none placeholder:text-stone-400"
            />
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full border px-5 py-2 text-sm font-bold transition ${
              selectedCategory === "all"
                ? "border-orange-500 bg-orange-500 text-white"
                : "border-orange-100 bg-white text-stone-600 hover:text-orange-600"
            }`}
          >
            Todos
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full border px-5 py-2 text-sm font-bold transition ${
                selectedCategory === category.id
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-orange-100 bg-white text-stone-600 hover:text-orange-600"
              }`}
            >
              {category.descripcion}
            </button>
          ))}
        </div>

        <p className="mt-8 text-sm font-semibold text-[#8a2f05]">
          {filteredProducts.length} productos encontrados
        </p>

        {loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-lg border border-orange-100 bg-white"
              />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="relative">
                <MenuProductCard
                  product={product}
                  categoryName={categoryMap[product.categoria_id] ?? "Menú"}
                  isAuthenticated={isAuthenticated}
                  onAuthRequired={handleAuthRequired}
                  onOrder={handleOrder}
                />
                {orderingId === product.id && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/70 text-sm font-black text-orange-600 backdrop-blur-sm">
                    Enviando pedido...
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-orange-200 bg-white px-6 py-10 text-center">
            <Utensils size={34} className="text-orange-500" />
            <h2 className="mt-4 text-xl font-black text-[#240800]">
              Sin productos para mostrar
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-stone-500">
              Prueba con otra búsqueda o cambia de categoría.
            </p>
          </div>
        )}

        {products.length > 0 && (
          <p className="sr-only">
            El rango de precios mostrado va desde{" "}
            {currencyFormatter.format(Math.min(...products.map((p) => p.precio)))}
            .
          </p>
        )}
      </main>
    </div>
  );
}
