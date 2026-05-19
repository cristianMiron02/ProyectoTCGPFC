import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    updateDoc
} from "firebase/firestore";

import { db } from "../firebase/firebase.js";
import { useAuth } from "../auth/useAuth.js";

export default function AdminProductForm() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    const isEdit = Boolean(productId);

    const [isAdmin, setIsAdmin] = useState(false);
    const [checkingAdmin, setCheckingAdmin] = useState(true);

    const [nombre, setNombre] = useState("");
    const [categoria, setCategoria] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagen, setImagen] = useState("");
    const [fecha, setFecha] = useState("");
    const [destacado, setDestacado] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
        try {
            if (!user) {
            setCheckingAdmin(false);
            return;
            }

            const userSnap = await getDoc(doc(db, "users", user.uid));

            if (!userSnap.exists() || userSnap.data().role !== "admin") {
            setIsAdmin(false);
            setCheckingAdmin(false);
            return;
            }

            setIsAdmin(true);

            if (isEdit) {
            const productSnap = await getDoc(doc(db, "products", productId));

            if (!productSnap.exists()) {
                setError("La carta no existe.");
                setCheckingAdmin(false);
                return;
            }

            const data = productSnap.data();

            setNombre(data.nombre || "");
            setCategoria(data.categoria || "");
            setDescripcion(data.descripcion || "");
            setImagen(data.imagen || "");
            setFecha(data.fecha || "");
            setDestacado(Boolean(data.destacado));
            }
        } catch (err) {
            console.error("Error cargando formulario:", err);
            setError("Error cargando los datos.");
        } finally {
            setCheckingAdmin(false);
        }
        }

        if (!authLoading) load();
    }, [user, authLoading, isEdit, productId]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!nombre.trim() || !categoria.trim() || !descripcion.trim() || !imagen.trim()) {
        setError("Completa nombre, categoría, descripción e imagen.");
        return;
        }

        const productData = {
        nombre,
        categoria,
        descripcion,
        imagen,
        fecha,
        destacado
        };

        try {
        if (isEdit) {
            await updateDoc(doc(db, "products", productId), productData);
        } else {
            await addDoc(collection(db, "products"), {
            ...productData,
            createdAt: new Date().toISOString()
            });
        }

        navigate("/admin/products");
        } catch (err) {
        console.error("Error guardando carta:", err);
        setError("No se pudo guardar la carta.");
        }
    }

    if (authLoading || checkingAdmin) {
        return <div className="container-fluid py-4">Comprobando permisos...</div>;
    }

    if (!user) {
        return (
        <div className="container-fluid py-4">
            <div className="alert alert-warning">Debes iniciar sesión.</div>
            <Link to="/login" className="btn btn-primary">
            Iniciar sesión
            </Link>
        </div>
        );
    }

    if (!isAdmin) {
        return (
        <div className="container-fluid py-4">
            <div className="alert alert-danger">
            No tienes permisos de administrador.
            </div>
            <Link to="/" className="btn btn-outline-primary">
            Volver al inicio
            </Link>
        </div>
        );
    }

    return (
        <div className="container-fluid py-4">
        <Link to="/admin/products" className="text-decoration-none">
            ← Volver al panel admin
        </Link>

        <div className="p-4 border rounded-3 mt-3">
            <h1 className="mb-3">
            {isEdit ? "Editar carta base" : "Nueva carta base"}
            </h1>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} style={{ maxWidth: 700 }}>
            <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Carta Pokémon – Charizard EX"
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Categoría</label>
                <select
                className="form-select"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                >
                <option value="">Selecciona categoría</option>
                <option value="Pokémon">Pokémon</option>
                <option value="One Piece">One Piece</option>
                <option value="Gundam">Gundam</option>
                <option value="Riftbound">Riftbound</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                className="form-control"
                rows="4"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">URL de imagen</label>
                <input
                className="form-control"
                value={imagen}
                onChange={(e) => setImagen(e.target.value)}
                placeholder="https://..."
                />
            </div>

            {imagen && (
                <div className="mb-3">
                <label className="form-label">Vista previa</label>
                <div>
                    <img
                    src={imagen}
                    alt={nombre}
                    style={{
                        width: 160,
                        height: 220,
                        objectFit: "contain",
                        border: "1px solid #ddd",
                        borderRadius: 8
                    }}
                    />
                </div>
                </div>
            )}

            <div className="mb-3">
                <label className="form-label">Año / fecha</label>
                <input
                className="form-control"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                placeholder="Ej: 2024"
                />
            </div>

            <div className="form-check mb-4">
                <input
                className="form-check-input"
                type="checkbox"
                checked={destacado}
                onChange={(e) => setDestacado(e.target.checked)}
                id="destacado"
                />
                <label className="form-check-label" htmlFor="destacado">
                Producto destacado
                </label>
            </div>

            <button className="btn btn-primary" type="submit">
                {isEdit ? "Guardar cambios" : "Crear carta"}
            </button>
            </form>
        </div>
        </div>
    );
}