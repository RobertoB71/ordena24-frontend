import { ApiServices } from "../API/apiServices";
import type {
  Rol,
  Usuario,
  UsuarioCreatePayload,
  UsuarioPayload,
} from "../../models/usuario";

export class UsuarioServices extends ApiServices {
  private path = "/api/usuarios";

  public getUsuarios = () => {
    return this.instance.get<Usuario[]>(`${this.path}/`);
  };

  public getUsuarioById = (id: number) => {
    return this.instance.get<Usuario>(`${this.path}/${id}`);
  };

  public getRoles = () => {
    return this.instance.get<Rol[]>(`${this.path}/roles`);
  };

  public createUsuario = (usuario: UsuarioCreatePayload) => {
    return this.instance.post<Usuario>(`${this.path}/`, usuario);
  };

  public updateUsuario = (id: number, usuario: Partial<UsuarioPayload>) => {
    return this.instance.put<Usuario>(`${this.path}/${id}`, usuario);
  };

  public deshabilitarUsuario = (id: number) => {
    return this.instance.put<Usuario>(`${this.path}/${id}/deshabilitar`);
  };

  public habilitarUsuario = (id: number) => {
    return this.instance.put<Usuario>(`${this.path}/${id}/habilitar`);
  };
}

export const UsuarioInstance = new UsuarioServices();
