export interface DetallePedido {
  producto_id: number;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  cliente_nombre: string;
  cliente_email: string;
  direccion_entrega: string;
  telefono?: string | null;
  total: number;
  estado: string;
  detalle: DetallePedido[];
}

export interface PedidoPayload {
  cliente_nombre: string;
  cliente_email: string;
  direccion_entrega: string;
  telefono?: string | null;
  total: number;
  estado: string;
  detalle: DetallePedido[];
}

export interface PedidoEstadoPayload {
  estado: string;
}