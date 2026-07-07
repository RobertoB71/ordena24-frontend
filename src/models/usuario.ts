export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol_id: number;
  activo: boolean;
}

export interface Rol {
  id: number;
  descripcion: string;
}

export interface UsuarioPayload {
  nombre: string;
  email: string;
  rol_id: number;
  activo?: boolean;
  password?: string;
}

export interface UsuarioCreatePayload {
  nombre: string;
  email: string;
  password: string;
  rol_id: number;
}
