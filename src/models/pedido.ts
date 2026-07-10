export interface DetallePedido {
  id?: number;
  producto_id: number;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  usuario_id: number;
  cliente_nombre: string;
  cliente_email: string;
  direccion_entrega: string;
  telefono?: string | null;
  subtotal: number;
  costo_envio: number;
  total: number;
  estado: string;
  fecha_registro?: string;
  detalle: DetallePedido[];
}

export interface PedidoDetallePayload {
  producto_id: number;
  cantidad: number;
}

export interface PedidoPayload {
  usuario_id: number;
  cliente_nombre: string;
  cliente_email: string;
  direccion_entrega: string;
  telefono?: string | null;
  detalle: PedidoDetallePayload[];
}

export interface PedidoEstadoPayload {
  estado: string;
}
