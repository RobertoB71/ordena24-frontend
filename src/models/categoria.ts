export interface Categoria {
  id: number;
  descripcion: string;
  activo: boolean;
}

export interface CategoriaPayload {
  descripcion: string;
  activo?: boolean;
}
