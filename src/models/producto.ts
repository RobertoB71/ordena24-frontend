export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  categoria_id: number;
  disponible: boolean;
  imagen_url?: string | null;
}

export interface ProductoPayload {
  nombre: string;
  descripcion?: string | null;
  precio: number;
  categoria_id: number;
  disponible: boolean;
  imagen_url?: string | null;
  imagen?: File | null;
}
