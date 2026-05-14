import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { db } from "../firebase/firebase.js";
import { useAuth } from "../auth/useAuth.js";

export default function EditOffer() {
    const { offerId } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    const [offer, setOffer] = useState(null);
    const [estado, setEstado] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [envio, setEnvio] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
        try {
            const ref = doc(db, "offers", offerId);
            const snap = await getDoc(ref);

            if (!snap.exists()) {
            setError("Oferta no encontrada.");
            return;
            }

            const data = { id: snap.id, ...snap.data() };

            if (!user || data.sellerId !== user.uid) {
            setError("No tienes permiso para editar esta oferta.");
            return;
            }

            setOffer(data);
            setEstado(data.estado || "");
            setPrecio(String(data.precio || ""));
            setStock(String(data.stock || ""));
            setEnvio(data.envio || "");
        } catch (err) {
            console.error("Error cargando oferta:", err);
            setError("Error cargando la oferta.");
        } finally {
            setLoading(false);
        }
        }

        if (!authLoading && offerId) load();
    }, [offerId, user, authLoading]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!estado || !precio || !stock || !envio) {
        setError("Completa todos los campos.");
        return;
        }

        if (Number(precio) <= 0) {
        setError("El precio debe ser mayor que 0.");
        return;
        }

        if (Number(stock) < 0) {
        setError("El stock no puede ser negativo.");
        return;
        }

        try {
        await updateDoc(doc(db, "offers", offerId), {
            estado,
            precio: Number(precio),
            stock: Number(stock),
            envio,
            updatedAt: new Date().toISOString()
        });

        navigate(`/product/${offer.productId}`);
        } catch (err) {
        console.error("Error actualizando oferta:", err);
        setError("No se pudo actualizar la oferta.");
        }
    }

    if (loading || authLoading) {
        return <div className="container-fluid py-4">Cargando...</div>;
    }

    if (error && !offer) {
        return (
        <div className="container-fluid py-4">
            <div className="alert alert-danger">{error}</div>
            <Link to="/catalog" className="btn btn-outline-primary">
            Volver al catálogo
            </Link>
        </div>
        );
    }

    return (
        <div className="container-fluid py-4">
        <Link to={`/product/${offer.productId}`} className="text-decoration-none">
            ← Volver a la carta
        </Link>

        <div className="p-4 border rounded-3 mt-3">
            <h1 className="mb-3">Editar oferta</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
            <div className="mb-3">
                <label className="form-label">Estado de la carta</label>
                <select
                className="form-select"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                >
                <option value="">Selecciona estado</option>
                <option value="Mint">Mint</option>
                <option value="Near Mint">Near Mint</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Played">Played</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Precio (€)</label>
                <input
                type="number"
                className="form-control"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                min="0"
                step="0.01"
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Stock</label>
                <input
                type="number"
                className="form-control"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
                step="1"
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Envío</label>
                <input
                className="form-control"
                value={envio}
                onChange={(e) => setEnvio(e.target.value)}
                />
            </div>

            <button className="btn btn-primary" type="submit">
                Guardar cambios
            </button>
            </form>
        </div>
        </div>
    );
}