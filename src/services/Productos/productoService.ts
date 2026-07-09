import { ApiServices } from "../API/apiServices";
import type { Producto, ProductoPayload } from "../../models/producto";

export class ProductoServices extends ApiServices {
  private path = "/api/productos";

  private buildProductoFormData = (producto: Partial<ProductoPayload>) => {
    const formData = new FormData();

    if (producto.nombre !== undefined) {
      formData.append("nombre", producto.nombre);
    }

    if (producto.descripcion !== undefined && producto.descripcion !== null) {
      formData.append("descripcion", producto.descripcion);
    }

    if (producto.precio !== undefined) {
      formData.append("precio", String(producto.precio));
    }

    if (producto.categoria_id !== undefined) {
      formData.append("categoria_id", String(producto.categoria_id));
    }

    if (producto.disponible !== undefined) {
      formData.append("disponible", String(producto.disponible));
    }

    if (producto.imagen) {
      formData.append("imagen", producto.imagen);
    }

    return formData;
  };

  public getProductos = () => {
    return this.instance.get<Producto[]>(`${this.path}/`);
  };

  public getProductoById = (id: number) => {
    return this.instance.get<Producto>(`${this.path}/${id}`);
  };

  public createProducto = (producto: ProductoPayload) => {
    return this.instance.post<Producto>(
      `${this.path}/`,
      this.buildProductoFormData(producto),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  };

  public updateProducto = (id: number, producto: Partial<ProductoPayload>) => {
    return this.instance.put<Producto>(
      `${this.path}/${id}`,
      this.buildProductoFormData(producto),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  };

  public toggleProductoEstado = (id: number) => {
    return this.instance.put<Producto>(`${this.path}/${id}/estado`);
  };

  public deleteProducto = (id: number) => {
    return this.instance.delete(`${this.path}/${id}`);
  };
}

export const ProductoInstance = new ProductoServices();
