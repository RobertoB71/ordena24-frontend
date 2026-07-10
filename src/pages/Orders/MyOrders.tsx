import { useEffect, useMemo, useState } from "react";
import { Ban, Clock3, ReceiptText, RefreshCw } from "lucide-react";

import Navbar from "../../components/navbar/Navbar";
import { useGeneralAlert } from "../../components/Alerts/GeneralAlerts/useGeneralAlert";
import { useAuth } from "../../hooks/Auth/useAuth";
import { PedidoInstance } from "../../services/Pedidos/pedidoService";
import type { Pedido } from "../../models/pedido";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value);

const canCancel = (estado: string) =>
  ["Pendiente", "En preparación"].includes(estado);

export default function MyOrders() {
  const { user } = useAuth();
  const { confirm, showError, showSuccess } = useGeneralAlert();
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const activeOrders = useMemo(
    () =>
      orders.filter(
        (order) => !["Entregado", "Cancelado"].includes(order.estado),
      ),
    [orders],
  );
  const completedOrders = useMemo(
    () =>
      orders.filter((order) =>
        ["Entregado", "Cancelado"].includes(order.estado),
      ),
    [orders],
  );

  const loadOrders = async () => {
    if (!user) {
      return;
    }

    setLoading(true);
    try {
      const response = await PedidoInstance.getPedidosByUsuario(user.id);
      setOrders(response.data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudieron cargar pedidos";

      showError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, [user?.id]);

  const handleCancel = async (order: Pedido) => {
    if (!user) {
      return;
    }

    const shouldCancel = await confirm({
      title: "Cancelar pedido",
      message: `Quieres cancelar el pedido #${order.id}?`,
      confirmText: "Si, cancelar",
      cancelText: "Mantener pedido",
      variant: "warning",
    });

    if (!shouldCancel) {
      return;
    }

    setUpdatingId(order.id);
    try {
      const response = await PedidoInstance.cancelPedido(order.id, user.id);
      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          currentOrder.id === order.id ? response.data : currentOrder,
        ),
      );
      showSuccess(`Pedido #${order.id} cancelado.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo cancelar el pedido";

      showError(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const renderOrder = (order: Pedido) => (
    <article
      key={order.id}
      className="rounded-lg border border-orange-100 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-black text-[#240800]">
              Pedido #{order.id}
            </h2>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">
              {order.estado}
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold text-[#8a2f05]">
            {order.direccion_entrega}
          </p>
        </div>
        <strong className="text-2xl font-black text-orange-600">
          {formatPrice(order.total)}
        </strong>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {order.detalle.map((item) => (
          <span
            key={`${order.id}-${item.producto_id}`}
            className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-[#8a2f05]"
          >
            {item.nombre_producto} x {item.cantidad}
          </span>
        ))}
      </div>

      <dl className="mt-5 grid gap-3 text-sm font-semibold text-stone-500 sm:grid-cols-3">
        <div>
          <dt>Subtotal</dt>
          <dd className="mt-1 text-[#240800]">{formatPrice(order.subtotal)}</dd>
        </div>
        <div>
          <dt>Envio</dt>
          <dd className="mt-1 text-[#240800]">
            {formatPrice(order.costo_envio)}
          </dd>
        </div>
        <div>
          <dt>Fecha</dt>
          <dd className="mt-1 text-[#240800]">
            {order.fecha_registro
              ? new Date(order.fecha_registro).toLocaleString("es-ES")
              : "Sin fecha"}
          </dd>
        </div>
      </dl>

      {canCancel(order.estado) && (
        <button
          type="button"
          disabled={updatingId === order.id}
          onClick={() => void handleCancel(order)}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-black text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Ban size={16} />
          {updatingId === order.id ? "Cancelando..." : "Cancelar pedido"}
        </button>
      )}
    </article>
  );

  return (
    <div className="min-h-screen bg-[#fffaf4]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-10 text-left sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black text-orange-600">Cliente</p>
            <h1 className="mt-2 font-serif text-4xl font-black text-[#240800]">
              Mis pedidos
            </h1>
          </div>
          <button
            type="button"
            onClick={() => void loadOrders()}
            className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white px-4 py-2 text-sm font-black text-[#8a2f05] transition hover:bg-orange-50"
          >
            <RefreshCw size={16} />
            Actualizar
          </button>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-44 animate-pulse rounded-lg border border-orange-100 bg-white"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <section className="mt-10 flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-orange-200 bg-white px-6 py-12 text-center">
            <ReceiptText size={42} className="text-orange-500" />
            <h2 className="mt-4 text-2xl font-black text-[#240800]">
              Aun no tienes pedidos
            </h2>
          </section>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Clock3 size={18} className="text-orange-600" />
                <h2 className="text-xl font-black text-[#240800]">
                  Activos
                </h2>
              </div>
              <div className="grid gap-4">
                {activeOrders.length > 0 ? (
                  activeOrders.map(renderOrder)
                ) : (
                  <p className="rounded-lg border border-orange-100 bg-white p-5 text-sm font-semibold text-stone-500">
                    No hay pedidos activos.
                  </p>
                )}
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-2">
                <ReceiptText size={18} className="text-orange-600" />
                <h2 className="text-xl font-black text-[#240800]">
                  Antiguos
                </h2>
              </div>
              <div className="grid gap-4">
                {completedOrders.length > 0 ? (
                  completedOrders.map(renderOrder)
                ) : (
                  <p className="rounded-lg border border-orange-100 bg-white p-5 text-sm font-semibold text-stone-500">
                    No hay pedidos completados.
                  </p>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
