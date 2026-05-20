import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    collection,
    getDocs,
    query,
    where,
    orderBy
} from "firebase/firestore";

import { db } from "../firebase/firebase.js";
import { useAuth } from "../auth/useAuth.js";

export default function Orders() {
    const { user, loading: authLoading } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadOrders() {
        try {
            if (!user) return;

            const q = query(collection(db, "orders"), where("buyerId", "==", user.uid));

            const snap = await getDocs(q);

            const data = snap.docs.map((docu) => ({
            id: docu.id,
            ...docu.data()
            }));

            setOrders(data);
        } catch (err) {
            console.error("Error cargando compras:", err);
        } finally {
            setLoading(false);
        }
        }

        if (!authLoading) {
        loadOrders();
        }
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
        <div className="container-fluid py-4">
            Cargando compras...
        </div>
        );
    }

    if (!user) {
        return (
        <div className="container-fluid py-4">
            <div className="alert alert-warning">
            Debes iniciar sesión.
            </div>

            <Link to="/login" className="btn btn-gold">
            Iniciar sesión
            </Link>
        </div>
        );
    }

    return (
        <div className="container-fluid py-4">
        <h1 className="mb-4">Mis compras</h1>

        {orders.length === 0 ? (
            <div className="alert alert-info">
            Todavía no has realizado compras.
            </div>
        ) : (
            <div className="row g-4">

            {orders.map((order) => (
                <div
                className="col-12 col-lg-6"
                key={order.id}
                >
                <div className="card bg-dark text-white border-secondary h-100 shadow">

                    <div className="card-body">

                    <div className="d-flex gap-3">

                        <img
                        src={order.productImage}
                        alt={order.productName}
                        style={{
                            width: 120,
                            height: 160,
                            objectFit: "contain",
                            borderRadius: 10
                        }}
                        />

                        <div className="flex-grow-1">

                        <h4>
                            {order.productName}
                        </h4>

                        <div className="text-muted mb-2">
                            {order.categoria}
                        </div>

                        <div className="mb-1">
                            👤 Vendedor:{" "}
                            <strong>
                            {order.sellerName}
                            </strong>
                        </div>

                        <div className="mb-1">
                            🌍 Nacionalidad:{" "}
                            {order.sellerNationality || "-"}
                        </div>

                        <div className="mb-1">
                            🗣 Idioma:{" "}
                            {order.idiomaCarta || "-"}
                        </div>

                        <div className="mb-1">
                            📦 Estado:{" "}
                            {order.estado || "-"}
                        </div>

                        <div className="mb-1">
                            🔢 Cantidad:{" "}
                            {order.qty}
                        </div>

                        <div className="mb-1">
                            💰 Precio unidad:{" "}
                            {Number(order.price).toLocaleString("es-ES")} €
                        </div>

                        <div className="fs-5 fw-bold text-warning mt-2">
                            Total:{" "}
                            {Number(order.total).toLocaleString("es-ES")} €
                        </div>

                        <div
                            className="text-muted mt-2"
                            style={{ fontSize: "0.9rem" }}
                        >
                            {new Date(order.createdAt).toLocaleString("es-ES")}
                        </div>

                        </div>
                    </div>

                    </div>
                </div>
                </div>
            ))}

            </div>
        )}
        </div>
    );
}