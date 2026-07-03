import { ApiServices } from "../API/apiServices";
import type { Categoria, CategoriaPayload } from "../../models/categoria";

export class CategoriaServices extends ApiServices {
  private path = "/api/categorias";

  public getCategorias = () => {
    return this.instance.get<Categoria[]>(`${this.path}/`);
  };

  public getCategoriaById = (id: number) => {
    return this.instance.get<Categoria>(`${this.path}/${id}`);
  };

  public createCategoria = (categoria: CategoriaPayload) => {
    return this.instance.post<Categoria>(`${this.path}/`, categoria);
  };

  public updateCategoria = (id: number, categoria: Partial<CategoriaPayload>) => {
    return this.instance.put<Categoria>(`${this.path}/${id}`, categoria);
  };

  public deleteCategoria = (id: number) => {
    return this.instance.delete(`${this.path}/${id}`);
  };
}

export const CategoriaInstance = new CategoriaServices();