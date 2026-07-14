import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  ClipboardList,
  Download,
  Eye,
  MapPin,
  RefreshCw,
} from "lucide-react";

import Navbar from "../../components/navbar/Navbar";
import { useGeneralAlert } from "../../components/Alerts/GeneralAlerts/useGeneralAlert";
import { useAuth } from "../../hooks/Auth/useAuth";
import { PedidoInstance } from "../../services/Pedidos/pedidoService";
import { ReporteInstance } from "../../services/Reportes/reporteService";
import type { Pedido } from "../../models/pedido";

const statuses = [
  "Todos",
  "Pendiente",
  "En preparación",
  "Enviado",
  "Entregado",
  "Cancelado",
] as const;

const nextStatus: Record<string, string | null> = {
  Pendiente: "En preparación",
  "En preparación": "Enviado",
  Enviado: "Entregado",
  Entregado: null,
  Cancelado: null,
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value);

export default function WorkerOrders() {
  const { user } = useAuth();
  const { confirm, showError, showSuccess } = useGeneralAlert();
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [selectedStatus, setSelectedStatus] =
    useState<(typeof statuses)[number]>("Todos");
  const [selectedOrder, setSelectedOrder] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [downloadingReport, setDownloadingReport] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await PedidoInstance.getPedidos();
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
  }, []);

  const filteredOrders = useMemo(() => {
    if (selectedStatus === "Todos") {
      return orders;
    }

    return orders.filter((order) => order.estado === selectedStatus);
  }, [orders, selectedStatus]);

  const counts = useMemo(
    () => ({
      pendientes: orders.filter((order) => order.estado === "Pendiente").length,
      preparacion: orders.filter((order) => order.estado === "En preparación")
        .length,
      enviados: orders.filter((order) => order.estado === "Enviado").length,
      entregados: orders.filter((order) => order.estado === "Entregado").length,
    }),
    [orders],
  );

  const handleAdvanceStatus = async (order: Pedido) => {
    const estado = nextStatus[order.estado];

    if (!estado) {
      return;
    }

    const shouldAdvance = await confirm({
      title: "Cambiar estado",
      message: `Quieres cambiar el pedido #${order.id} de ${order.estado} a ${estado}?`,
      confirmText: "Si, cambiar",
      cancelText: "Mantener estado",
      variant: "warning",
    });

    if (!shouldAdvance) {
      return;
    }

    setUpdatingId(order.id);
    try {
      const response = await PedidoInstance.updateEstadoPedido(order.id, {
        estado,
      });
      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          currentOrder.id === order.id ? response.data : currentOrder,
        ),
      );
      setSelectedOrder((currentOrder) =>
        currentOrder?.id === order.id ? response.data : currentOrder,
      );
      showSuccess(`Pedido #${order.id} actualizado a ${estado}.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo actualizar pedido";

      showError(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownloadReport = async () => {
    setDownloadingReport(true);

    try {
      const estado = selectedStatus === "Todos" ? undefined : selectedStatus;
      const response = await ReporteInstance.descargarReportePedidos(estado);
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      const statusSuffix = estado
        ? `-${estado.toLowerCase().replaceAll(" ", "-")}`
        : "";

      link.href = url;
      link.download = `reporte-pedidos${statusSuffix}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSuccess("Reporte descargado correctamente.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo generar el reporte";

      showError(message);
    } finally {
      setDownloadingReport(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf4]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-10 text-left sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black text-orange-600">
              Panel de trabajador
            </p>
            <h1 className="mt-2 font-serif text-4xl font-black text-[#240800]">
              Gestion de pedidos
            </h1>
            <p className="mt-2 font-semibold text-[#8a2f05]">
              Hola, {user?.nombre}. Aqui estan los pedidos activos.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={downloadingReport}
              onClick={() => void handleDownloadReport()}
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download size={16} />
              {downloadingReport ? "Generando..." : "Descargar reporte"}
            </button>
            <button
              type="button"
              onClick={() => void loadOrders()}
              className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white px-4 py-2 text-sm font-black text-[#8a2f05] transition hover:bg-orange-50"
            >
              <RefreshCw size={16} />
              Actualizar
            </button>
          </div>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Pendientes" value={counts.pendientes} />
          <SummaryCard label="En preparacion" value={counts.preparacion} />
          <SummaryCard label="En camino" value={counts.enviados} />
          <SummaryCard label="Entregados" value={counts.entregados} />
        </section>

        <div className="mt-8 flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedStatus(status)}
              className={`rounded-full border px-5 py-2 text-sm font-bold transition ${
                selectedStatus === status
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-orange-100 bg-white text-stone-600 hover:text-orange-600"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <section className="mt-6 grid gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-44 animate-pulse rounded-lg border border-orange-100 bg-white"
              />
            ))
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const next = nextStatus[order.estado];

              return (
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
                        {order.cliente_nombre} - {order.cliente_email}
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

                  <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8a2f05]">
                    <MapPin size={16} />
                    {order.direccion_entrega}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {next && (
                      <button
                        type="button"
                        disabled={updatingId === order.id}
                        onClick={() => void handleAdvanceStatus(order)}
                        className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <ChevronRight size={16} />
                        {updatingId === order.id ? "Actualizando..." : next}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-[#240800] transition hover:bg-orange-100"
                    >
                      <Eye size={16} />
                      Ver detalle
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="flex min-h-60 flex-col items-center justify-center rounded-lg border border-dashed border-orange-200 bg-white px-6 py-10 text-center">
              <ClipboardList size={38} className="text-orange-500" />
              <h2 className="mt-4 text-xl font-black text-[#240800]">
                No hay pedidos en este filtro
              </h2>
            </div>
          )}
        </section>
      </main>

      {selectedOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-950/45 px-4 py-6">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 text-left shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black text-orange-600">
                  Detalle del pedido
                </p>
                <h2 className="mt-1 text-2xl font-black text-[#240800]">
                  Pedido #{selectedOrder.id}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-black text-stone-600 transition hover:bg-stone-50"
              >
                Cerrar
              </button>
            </div>

            <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
              <Detail label="Cliente" value={selectedOrder.cliente_nombre} />
              <Detail label="Email" value={selectedOrder.cliente_email} />
              <Detail
                label="Telefono"
                value={selectedOrder.telefono || "Sin telefono"}
              />
              <Detail label="Estado" value={selectedOrder.estado} />
              <Detail
                label="Direccion"
                value={selectedOrder.direccion_entrega}
              />
              <Detail label="Total" value={formatPrice(selectedOrder.total)} />
            </dl>

            <div className="mt-6 divide-y divide-orange-100 rounded-lg border border-orange-100">
              {selectedOrder.detalle.map((item) => (
                <div
                  key={`${selectedOrder.id}-${item.producto_id}`}
                  className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                >
                  <span className="font-bold text-[#240800]">
                    {item.nombre_producto} x {item.cantidad}
                  </span>
                  <span className="font-black text-orange-600">
                    {formatPrice(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-orange-100 bg-white p-5 shadow-sm">
      <p className="text-3xl font-black text-orange-600">{value}</p>
      <p className="mt-2 text-sm font-bold text-[#240800]">{label}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-black text-stone-500">{label}</dt>
      <dd className="mt-1 font-semibold text-[#240800]">{value}</dd>
    </div>
  );
}
