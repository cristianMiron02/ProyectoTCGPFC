import { useState } from "react";
import { useCart } from "../cart/CartContext.jsx";
import { useAuth } from "../auth/useAuth.js";

import {
    addDoc,
    collection,
    doc,
    getDoc,
    updateDoc
} from "firebase/firestore";

import { db } from "../firebase/firebase.js";

export default function Cart() {
    const { items, removeFromCart, clearCart, total } = useCart();
    const { user } = useAuth();

    const [buying, setBuying] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    function confirmRemove(item) {
        const ok = window.confirm(`¿Seguro que quieres eliminar "${item.nombre}"?`);
        if (ok) removeFromCart(item.offerId || item.id);
    }

    async function handleCheckout() {
        setError("");
        setMessage("");

        if (!user) {
        setError("Debes iniciar sesión para finalizar la compra.");
        return;
        }

        if (items.length === 0) {
        setError("El carrito está vacío.");
        return;
        }

        const ok = window.confirm("¿Quieres finalizar la compra?");
        if (!ok) return;

        try {
        setBuying(true);

        for (const item of items) {
            if (!item.offerId) {
            throw new Error("Hay un producto sin oferta asociada.");
            }

            const offerRef = doc(db, "offers", item.offerId);
            const offerSnap = await getDoc(offerRef);

            if (!offerSnap.exists()) {
            throw new Error(`La oferta de "${item.nombre}" ya no existe.`);
            }

            const offerData = offerSnap.data();
            const currentStock = Number(offerData.stock);
            const qty = Number(item.qty);

            if (currentStock < qty) {
            throw new Error(
                `No hay stock suficiente para "${item.nombre}". Stock disponible: ${currentStock}`
            );
            }

            const newStock = currentStock - qty;

            await addDoc(collection(db, "orders"), {
            buyerId: user.uid,
            buyerEmail: user.email,

            sellerId: item.sellerId,
            sellerName: item.sellerName,

            productId: item.id,
            productName: item.nombre,
            productImage: item.imagen,
            categoria: item.categoria,

            offerId: item.offerId,
            estado: item.estado,
            idiomaCarta: item.idiomaCarta,
            sellerNationality: item.sellerNationality,

            qty: qty,
            price: Number(item.precio),
            total: Number(item.precio) * qty,

            createdAt: new Date().toISOString()
            });

            await updateDoc(offerRef, {
            stock: newStock
            });
        }

        clearCart();
        setMessage("Compra realizada correctamente.");
        } catch (err) {
        console.error("Error finalizando compra:", err);
        setError(err.message || "No se pudo finalizar la compra.");
        } finally {
        setBuying(false);
        }
    }

    return (
        <div className="container-fluid py-4">
        <h1 className="mb-3">Carrito</h1>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

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
                            {Number(item.precio).toLocaleString("es-ES")} €
                        </td>

                        <td className="text-end fw-semibold">
                            {subtotal.toLocaleString("es-ES")} €
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
                <div className="fs-5">
                Total:{" "}
                <span className="fw-bold">
                    {total.toLocaleString("es-ES")} €
                </span>
                </div>
            </div>

            <div className="d-flex justify-content-end mt-3">
                <button
                className="btn btn-success"
                onClick={handleCheckout}
                disabled={buying}
                >
                {buying ? "Procesando compra..." : "Finalizar compra"}
                </button>
            </div>
            </>
        )}
        </div>
    );
}