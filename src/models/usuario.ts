export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol_id: number;
  activo: boolean;
}

export interface UsuarioPayload {
  nombre: string;
  email: string;
  rol_id: number;
  activo?: boolean;
  password?: string;
}
