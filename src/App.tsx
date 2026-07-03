import { useEffect, useState } from "react";
import { ProductoInstance } from "../src/services/Productos/productoService";
import type { Producto } from "./models/producto";

export default function MenuPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ProductoInstance.getProductos()
      .then((res) => {
        setProductos(res.data);
      })
      .catch((error) => {
        console.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  return (
    <div>
      <h1>Menú Ordena24</h1>

      {productos.map((producto) => (
        <div key={producto.id}>
          <h2>{producto.nombre}</h2>
          <p>{producto.descripcion}</p>
          <strong>${producto.precio}</strong>
        </div>
      ))}
    </div>
  );
}