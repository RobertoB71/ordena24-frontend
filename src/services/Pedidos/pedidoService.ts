import { ApiServices } from "../API/apiServices";
import type {
  Pedido,
  PedidoPayload,
  PedidoEstadoPayload,
} from "../../models/pedido";

export class PedidoServices extends ApiServices {
  private path = "/api/pedidos";

  public getPedidos = () => {
    return this.instance.get<Pedido[]>(`${this.path}/`);
  };

  public getPedidoById = (id: number) => {
    return this.instance.get<Pedido>(`${this.path}/${id}`);
  };

  public getPedidosByUsuario = (usuarioId: number) => {
    return this.instance.get<Pedido[]>(`${this.path}/usuario/${usuarioId}`);
  };

  public createPedido = (pedido: PedidoPayload) => {
    return this.instance.post<Pedido>(`${this.path}/`, pedido);
  };

  public updateEstadoPedido = (id: number, data: PedidoEstadoPayload) => {
    return this.instance.put<Pedido>(`${this.path}/${id}/estado`, data);
  };

  public cancelPedido = (pedidoId: number, usuarioId: number) => {
    return this.instance.put<Pedido>(
      `${this.path}/${pedidoId}/cancelar/${usuarioId}`,
    );
  };

  public deletePedido = (id: number) => {
    return this.instance.delete(`${this.path}/${id}`);
  };
}

export const PedidoInstance = new PedidoServices();
