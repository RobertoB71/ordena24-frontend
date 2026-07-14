import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import CategoriesSection from "../../components/home/CategoriesSection";
import HomeCta from "../../components/home/HomeCta";
import HomeFooter from "../../components/home/HomeFooter";
import HomeHero from "../../components/home/HomeHero";
import PopularSection from "../../components/home/PopularSection";
import StatsStrip from "../../components/home/StatsStrip";
import { useAuth } from "../../hooks/Auth/useAuth";
import { CategoriaInstance } from "../../services/Categorias/categoriaService";
import { ProductoInstance } from "../../services/Productos/productoService";
import type { Categoria } from "../../models/categoria";
import type { Producto } from "../../models/producto";

export default function Home() {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [products, setProducts] = useState<Producto[]>([]);

  useEffect(() => {
    let isMounted = true;
    const loadHomeData = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          CategoriaInstance.getCategoriasActivas(),
          ProductoInstance.getProductos(),
        ]);
        if (isMounted) {
          setCategories(categoriesResponse.data);
          setProducts(productsResponse.data.filter((product) => product.disponible).slice(0, 3));
        }
      } catch {
        if (isMounted) {
          setCategories([]);
          setProducts([]);
        }
      } finally {
        if (isMounted) setCategoriesLoading(false);
      }
    };
    void loadHomeData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-[#fffaf4]">
      <Navbar />
      <main>
        <HomeHero isAuthenticated={isAuthenticated} />
        <StatsStrip />
        <CategoriesSection categories={categories} loading={categoriesLoading} />
        <PopularSection products={products} categories={categories} loading={categoriesLoading} />
        <HomeCta isAuthenticated={isAuthenticated} />
      </main>
      <HomeFooter />
    </div>
  );
}
