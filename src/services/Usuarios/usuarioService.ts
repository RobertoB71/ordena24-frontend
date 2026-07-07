import { ApiServices } from "../API/apiServices";
import type { Usuario, UsuarioPayload } from "../../models/usuario";

export class UsuarioServices extends ApiServices {
  private path = "/api/usuarios";

  public getUsuarios = () => {
    return this.instance.get<Usuario[]>(`${this.path}/`);
  };

  public getUsuarioById = (id: number) => {
    return this.instance.get<Usuario>(`${this.path}/${id}`);
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
