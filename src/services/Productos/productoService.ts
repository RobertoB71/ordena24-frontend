import { ApiServices } from "../API/apiServices";
import type { Producto, ProductoPayload } from "../../models/producto";

export class ProductoServices extends ApiServices {
  private path = "/api/productos";

  public getProductos = () => {
    return this.instance.get<Producto[]>(`${this.path}/`);
  };

  public getProductoById = (id: number) => {
    return this.instance.get<Producto>(`${this.path}/${id}`);
  };

  public createProducto = (producto: ProductoPayload) => {
    return this.instance.post<Producto>(`${this.path}/`, producto);
  };

  public updateProducto = (id: number, producto: Partial<ProductoPayload>) => {
    return this.instance.put<Producto>(`${this.path}/${id}`, producto);
  };

  public deleteProducto = (id: number) => {
    return this.instance.delete(`${this.path}/${id}`);
  };
}

export const ProductoInstance = new ProductoServices();