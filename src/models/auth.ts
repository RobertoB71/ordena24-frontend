export interface User {
  id: number;
  nombre: string;
  email: string;
  rol_id: number;
  activo: boolean;
}

export interface LoginModel {
  email: string;
  password: string;
}

export interface RegisterModel {
  nombre: string;
  email: string;
  password: string;
  rol_id?: number;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  usuario: User;
}