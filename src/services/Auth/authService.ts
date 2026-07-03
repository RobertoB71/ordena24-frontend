import { ApiServices } from "../API/apiServices";
import type {
  LoginModel,
  LoginResponse,
  RegisterModel,
  User,
} from "../../models/auth";

export class AuthService extends ApiServices {
  private path = "/api/auth";

  public login = (data: LoginModel) => {
    return this.instance.post<LoginResponse>(`${this.path}/login`, {
      email: data.email.trim(),
      password: data.password.trim(),
    });
  };

  public register = (data: RegisterModel) => {
    return this.instance.post<User>(`${this.path}/register`, {
      nombre: data.nombre.trim(),
      email: data.email.trim(),
      password: data.password.trim(),
      rol_id: data.rol_id ?? 1,
    });
  };
}

export const AuthInstance = new AuthService();