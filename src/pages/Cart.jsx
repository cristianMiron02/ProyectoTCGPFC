import { useState } from "react";
import { useCart } from "../cart/CartContext.jsx";
import { useAuth } from "../auth/useAuth.js";

const COMMISSION_RATE = 0.05;

export default function Cart() {
    const { items, removeFromCart, total } = useCart();
    const { user } = useAuth();

    const [buying, setBuying] = useState(false);
    const [error, setError] = useState("");

    const commission = total * COMMISSION_RATE;
    const finalTotal = total + commission;

    function confirmRemove(item) {
        const ok = window.confirm(`¿Seguro que quieres eliminar "${item.nombre}"?`);
        if (ok) removeFromCart(item.offerId || item.id);
    }

    async function handleStripePayment() {
        setError("");

        if (!user) {
            setError("Debes iniciar sesión para pagar.");
            return;
        }

        if (items.length === 0) {
            setError("El carrito está vacío.");
            return;
        }

        try {
            setBuying(true);

            const itemsWithCommission = [
                ...items,
                {
                    id: "platform-commission",
                    offerId: "platform-commission",
                    nombre: "Comisión de plataforma",
                    categoria: "Servicio",
                    precio: commission,
                    qty: 1
                }
            ];

            const res = await fetch("http://localhost:4242/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    items: itemsWithCommission,
                    userId: user.uid,
                    userEmail: user.email,
                    subtotal: total,
                    commission,
                    finalTotal
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "No se pudo iniciar el pago.");
            }

            window.location.href = data.url;
        } catch (err) {
            console.error("Error iniciando pago:", err);
            setError(err.message || "No se pudo iniciar el pago.");
            setBuying(false);
        }
    }

    return (
        <div className="container-fluid py-4">
            <h1 className="mb-3">Carrito</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            {items.length === 0 ? (
                <div className="alert alert-info">Tu carrito está vacío.</div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Vendedor</th>
                                    <th>Estado</th>
                                    <th>Idioma</th>
                                    <th className="text-center" style={{ width: 120 }}>
                                        Cantidad
                                    </th>
                                    <th className="text-end" style={{ width: 140 }}>
                                        Precio
                                    </th>
                                    <th className="text-end" style={{ width: 160 }}>
                                        Subtotal
                                    </th>
                                    <th style={{ width: 120 }}></th>
                                </tr>
                            </thead>

                            <tbody>
                                {items.map((item) => {
                                    const subtotal = Number(item.precio) * Number(item.qty);

                                    return (
                                        <tr key={item.offerId || item.id}>
                                            <td>
                                                <div className="d-flex gap-3 align-items-center">
                                                    <img
                                                        src={item.imagen}
                                                        alt={item.nombre}
                                                        className="rounded"
                                                        style={{
                                                            width: 96,
                                                            height: 64,
                                                            objectFit: "cover"
                                                        }}
                                                    />

                                                    <div>
                                                        <div className="fw-semibold">{item.nombre}</div>
                                                        <div className="text-muted small">
                                                            {item.categoria}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>{item.sellerName || "-"}</td>

                                            <td>{item.estado || "-"}</td>

                                            <td>{item.idiomaCarta || "-"}</td>

                                            <td className="text-center">{item.qty}</td>

                                            <td className="text-end">
                                                {Number(item.precio).toLocaleString("es-ES", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })} €
                                            </td>

                                            <td className="text-end fw-semibold">
                                                {subtotal.toLocaleString("es-ES", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })} €
                                            </td>

                                            <td className="text-end">
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => confirmRemove(item)}
                                                    disabled={buying}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-flex justify-content-end mt-3">
                        <div
                            className="text-end p-3 rounded"
                            style={{
                                backgroundColor: "#151515",
                                border: "1px solid #333",
                                minWidth: "280px"
                            }}
                        >
                            <div>
                                Subtotal:{" "}
                                <span className="fw-semibold">
                                    {total.toLocaleString("es-ES", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })} €
                                </span>
                            </div>

                            <div
                                style={{
                                    color: "#d4af37",
                                    fontWeight: "600"
                                }}
                            >
                                Comisión plataforma (5%):{" "}
                                <span>
                                    {commission.toLocaleString("es-ES", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })} €
                                </span>
                            </div>

                            <hr className="border-secondary" />

                            <div className="fs-5">
                                Total:{" "}
                                <span
                                    className="fw-bold"
                                    style={{ color: "#d4af37" }}
                                >
                                    {finalTotal.toLocaleString("es-ES", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })} €
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end mt-3">
                        <button
                            className="btn"
                            onClick={handleStripePayment}
                            disabled={buying}
                            style={{
                                backgroundColor: "#d4af37",
                                border: "1px solid #d4af37",
                                color: "#000",
                                fontWeight: 600
                            }}
                        >
                            {buying ? "Redirigiendo a Stripe..." : "Pagar con Stripe"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}