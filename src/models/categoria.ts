export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string | null;
  activo?: boolean;
}

export interface CategoriaPayload {
  nombre: string;
  descripcion?: string | null;
}
