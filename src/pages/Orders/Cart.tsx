import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../../components/navbar/Navbar";
import { resolveImageUrl } from "../../components/menu/cards/productImage";
import { useGeneralAlert } from "../../components/Alerts/GeneralAlerts/useGeneralAlert";
import { useAuth } from "../../hooks/Auth/useAuth";
import { useCart } from "../../context/CartContext";
import { PedidoInstance } from "../../services/Pedidos/pedidoService";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value);

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    items,
    itemCount,
    subtotal,
    shipping,
    total,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const { confirm, showError, showSuccess } = useGeneralAlert();

  const [step, setStep] = useState<"cart" | "address">("cart");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canContinue = items.length > 0;
  const canSubmit = useMemo(() => address.trim().length >= 8, [address]);

  const handleCreateOrder = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!canSubmit) {
      showError("Escribe una direccion de entrega valida.");
      return;
    }

    const shouldCreate = await confirm({
      title: "Confirmar pedido",
      message: `Quieres crear este pedido por ${formatPrice(total)}?`,
      confirmText: "Si, crear pedido",
      cancelText: "Revisar carrito",
      variant: "warning",
    });

    if (!shouldCreate) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await PedidoInstance.createPedido({
        usuario_id: user.id,
        cliente_nombre: user.nombre,
        cliente_email: user.email,
        telefono: phone.trim() || null,
        direccion_entrega: address.trim(),
        detalle: items.map((item) => ({
          producto_id: item.product.id,
          cantidad: item.quantity,
        })),
      });

      clearCart();
      showSuccess(`Pedido #${response.data.id} creado correctamente.`);
      navigate("/orders");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo crear el pedido";

      showError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf4]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-10 text-left sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black text-orange-600">Carrito</p>
            <h1 className="mt-2 font-serif text-4xl font-black text-[#240800]">
              Mi carrito de compra
            </h1>
          </div>

          <div className="flex items-center gap-3 text-sm font-bold text-stone-500">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-orange-200 bg-white text-orange-600">
              1
            </span>
            <span className={step === "cart" ? "text-orange-600" : ""}>
              Productos
            </span>
            <span className="h-px w-10 bg-orange-200" />
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-orange-200 bg-white text-orange-600">
              2
            </span>
            <span className={step === "address" ? "text-orange-600" : ""}>
              Direccion
            </span>
          </div>
        </div>

        {items.length === 0 ? (
          <section className="mt-10 flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed border-orange-200 bg-white px-6 py-12 text-center">
            <ShoppingCart size={42} className="text-orange-500" />
            <h2 className="mt-4 text-2xl font-black text-[#240800]">
              Tu carrito esta vacio
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-stone-500">
              Agrega productos desde el menu para preparar tu pedido.
            </p>
            <Link
              to="/menu"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-600"
            >
              <ArrowLeft size={17} />
              Ir al menu
            </Link>
          </section>
        ) : (
          <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem]">
            <div className="rounded-lg border border-orange-100 bg-white shadow-sm">
              {step === "cart" ? (
                <>
                  <div className="flex items-center justify-between border-b border-orange-100 px-5 py-4">
                    <h2 className="text-sm font-black text-[#240800]">
                      Tu pedido ({itemCount})
                    </h2>
                    <span className="text-sm font-bold text-stone-500">
                      Subtotal
                    </span>
                  </div>

                  <div className="divide-y divide-orange-100">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="grid gap-4 px-5 py-5 sm:grid-cols-[5.5rem_1fr_auto] sm:items-center"
                      >
                        <img
                          src={resolveImageUrl(item.product.imagen_url)}
                          alt={item.product.nombre}
                          className="h-24 w-24 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-black text-[#240800]">
                            {item.product.nombre}
                          </h3>
                          <p className="mt-1 text-sm font-semibold text-stone-500">
                            {formatPrice(item.product.precio)} por unidad
                          </p>
                          <div className="mt-4 inline-flex items-center rounded-full border border-orange-100 bg-orange-50">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                              className="flex h-9 w-9 items-center justify-center text-[#8a2f05] transition hover:text-orange-600"
                              aria-label="Reducir cantidad"
                            >
                              <Minus size={15} />
                            </button>
                            <span className="w-10 text-center text-sm font-black text-[#240800]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                              className="flex h-9 w-9 items-center justify-center text-[#8a2f05] transition hover:text-orange-600"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus size={15} />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                          <strong className="text-xl font-black text-[#240800]">
                            {formatPrice(item.product.precio * item.quantity)}
                          </strong>
                          <button
                            type="button"
                            onClick={() => removeItem(item.product.id)}
                            className="inline-flex items-center gap-2 rounded-full border border-red-100 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                            Quitar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-6">
                  <button
                    type="button"
                    onClick={() => setStep("cart")}
                    className="inline-flex items-center gap-2 text-sm font-black text-[#8a2f05] transition hover:text-orange-600"
                  >
                    <ArrowLeft size={17} />
                    Volver al carrito
                  </button>
                  <h2 className="mt-6 text-2xl font-black text-[#240800]">
                    Direccion de entrega
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-stone-500">
                    Usaremos tu nombre y correo de la sesion para registrar el
                    pedido.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-bold text-stone-700">
                      Nombre
                      <input
                        value={user?.nombre ?? ""}
                        disabled
                        className="mt-2 w-full rounded-lg border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-stone-600"
                      />
                    </label>
                    <label className="text-sm font-bold text-stone-700">
                      Email
                      <input
                        value={user?.email ?? ""}
                        disabled
                        className="mt-2 w-full rounded-lg border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-stone-600"
                      />
                    </label>
                  </div>

                  <label className="mt-5 block text-sm font-bold text-stone-700">
                    Telefono
                    <input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="Opcional"
                      className="mt-2 w-full rounded-lg border border-orange-100 bg-white px-4 py-3 text-sm text-stone-800 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                    />
                  </label>

                  <label className="mt-5 block text-sm font-bold text-stone-700">
                    Direccion
                    <textarea
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      rows={4}
                      placeholder="Calle, edificio, apartamento y referencias"
                      className="mt-2 w-full resize-none rounded-lg border border-orange-100 bg-white px-4 py-3 text-sm text-stone-800 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                    />
                  </label>
                </div>
              )}
            </div>

            <aside className="h-fit rounded-lg border border-orange-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-[#240800]">
                Resumen del pedido
              </h2>
              <dl className="mt-5 space-y-4 text-sm font-semibold text-stone-500">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="text-[#240800]">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Envio 5%</dt>
                  <dd className="text-[#240800]">{formatPrice(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-dashed border-orange-200 pt-4 text-base">
                  <dt className="text-[#240800]">Total</dt>
                  <dd className="text-xl font-black text-orange-600">
                    {formatPrice(total)}
                  </dd>
                </div>
              </dl>

              {step === "cart" ? (
                <button
                  type="button"
                  disabled={!canContinue}
                  onClick={() => setStep("address")}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <MapPin size={17} />
                  Siguiente
                </button>
              ) : (
                <button
                  type="button"
                  disabled={submitting || !canSubmit}
                  onClick={() => void handleCreateOrder()}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle2 size={17} />
                  {submitting ? "Creando pedido..." : "Confirmar pedido"}
                </button>
              )}
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}
