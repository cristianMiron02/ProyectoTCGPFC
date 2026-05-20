import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";

import { db } from "../firebase/firebase.js";
import { useAuth } from "../auth/useAuth.js";

export default function AdminProducts() {
    const { user, loading: authLoading } = useAuth();

    const [isAdmin, setIsAdmin] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadProducts() {
        const snap = await getDocs(collection(db, "products"));

        const data = snap.docs.map((docu) => ({
        id: docu.id,
        ...docu.data()
        }));

        setProducts(data);
    }

    useEffect(() => {
        async function load() {
        try {
            if (!user) return;

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists() && userSnap.data().role === "admin") {
            setIsAdmin(true);
            await loadProducts();
            }
        } catch (err) {
            console.error("Error cargando admin:", err);
        } finally {
            setLoading(false);
        }
        }

        if (!authLoading) load();
    }, [user, authLoading]);

    async function handleDelete(productId) {
        const ok = window.confirm("¿Seguro que quieres borrar esta carta base?");
        if (!ok) return;

        await deleteDoc(doc(db, "products", productId));
        await loadProducts();
    }

    if (authLoading || loading) {
        return <div className="container-fluid py-4">Cargando...</div>;
    }

    if (!user) {
        return (
        <div className="container-fluid py-4">
            <div className="alert alert-warning">
            Debes iniciar sesión.
            </div>
        </div>
        );
    }

    if (!isAdmin) {
        return (
        <div className="container-fluid py-4">
            <div className="alert alert-danger">
            No tienes permisos de administrador.
            </div>
        </div>
        );
    }

    return (
        <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Panel admin - Cartas base</h1>

            <Link to="/admin/products/new" className="btn" style={{backgroundColor: "#d4af37", borderColor: "#d4af37", color: "#000"}}>
            Nueva carta
            </Link>
        </div>

        {products.length === 0 ? (
            <div className="alert alert-info">No hay cartas creadas.</div>
        ) : (
            <div className="table-responsive">
            <table className="table table-bordered align-middle">
                <thead>
                <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Destacada</th>
                    <th className="text-end">Acciones</th>
                </tr>
                </thead>

                <tbody>
                {products.map((p) => (
                    <tr key={p.id}>
                    <td style={{ width: 90 }}>
                        <img
                        src={p.imagen}
                        alt={p.nombre}
                        style={{
                            width: 70,
                            height: 70,
                            objectFit: "contain"
                        }}
                        />
                    </td>

                    <td>{p.nombre}</td>
                    <td>{p.categoria}</td>
                    <td>{p.destacado ? "Sí" : "No"}</td>

                    <td className="text-end">
                        <Link
                        to={`/admin/products/edit/${p.id}`}
                        className="btn btn-sm btn-outline-primary me-2"
                        >
                        Editar
                        </Link>

                        <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(p.id)}
                        >
                        Borrar
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        </div>
    );
}