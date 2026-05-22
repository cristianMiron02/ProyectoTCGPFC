import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs
} from "firebase/firestore";

import { db } from "../firebase/firebase.js";
import { useAuth } from "../auth/useAuth.js";

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();

    const [isAdmin, setIsAdmin] = useState(false);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);

    const [totalUsers, setTotalUsers] = useState(0);
    const [totalOffers, setTotalOffers] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);

    const [loading, setLoading] = useState(true);

    async function loadAdminData() {
        const productsSnap = await getDocs(collection(db, "products"));
        const usersSnap = await getDocs(collection(db, "users"));
        const offersSnap = await getDocs(collection(db, "offers"));
        const ordersSnap = await getDocs(collection(db, "orders"));

        const productsData = productsSnap.docs.map((docu) => ({
            id: docu.id,
            ...docu.data()
        }));

        const usersData = usersSnap.docs.map((docu) => ({
            id: docu.id,
            ...docu.data()
        }));

        setProducts(productsData);
        setUsers(usersData);

        setTotalUsers(usersSnap.size);
        setTotalOffers(offersSnap.size);
        setTotalOrders(ordersSnap.size);
    }

    useEffect(() => {
        async function load() {
            try {
                if (!user) {
                    setLoading(false);
                    return;
                }

                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists() && userSnap.data().role === "admin") {
                    setIsAdmin(true);
                    await loadAdminData();
                }
            } catch (err) {
                console.error("Error cargando panel admin:", err);
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
        await loadAdminData();
    }

    if (authLoading || loading) {
        return <div className="container-fluid py-4">Cargando panel admin...</div>;
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
            <h1>Panel de administración</h1>
        </div>

        <div className="row g-4 mb-5">

            <div className="col-12 col-md-4">
            <div className="card bg-dark text-white border-secondary shadow h-100">
                <div className="card-body">
                <h5 className="text-warning">Usuarios</h5>

                <div className="display-5 fw-bold">
                    {totalUsers}
                </div>
                </div>
            </div>
            </div>

            <div className="col-12 col-md-4">
            <div className="card bg-dark text-white border-secondary shadow h-100">
                <div className="card-body">
                <h5 className="text-warning">Ofertas</h5>

                <div className="display-5 fw-bold">
                    {totalOffers}
                </div>
                </div>
            </div>
            </div>

            <div className="col-12 col-md-4">
            <div className="card bg-dark text-white border-secondary shadow h-100">
                <div className="card-body">
                <h5 className="text-warning">Ventas</h5>

                <div className="display-5 fw-bold">
                    {totalOrders}
                </div>
                </div>
            </div>
            </div>

        </div>

        <h2 className="mb-3">
            Usuarios registrados
        </h2>

        {users.length === 0 ? (
            <div className="alert alert-info">
            No hay usuarios registrados.
            </div>
        ) : (
            <div className="table-responsive mb-5">
            <table className="table table-dark table-bordered align-middle">

                <thead>
                <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Tipo cuenta</th>
                    <th>Nacionalidad</th>
                    <th>Rol</th>
                </tr>
                </thead>

                <tbody>

                {users.map((u) => (
                    <tr key={u.id}>

                    <td>
                        {u.username ||
                        `${u.nombre || ""} ${u.apellidos || ""}`}
                    </td>

                    <td>{u.email}</td>

                    <td>
                        {u.tipoCuenta === "buyer" && "Comprador"}
                        {u.tipoCuenta === "seller" && "Vendedor"}
                        {u.tipoCuenta === "both" && "Comprador/Vendedor"}
                        {!u.tipoCuenta && "-"}
                    </td>

                    <td>{u.nacionalidad || "-"}</td>

                    <td>
                        {u.role === "admin"
                        ? "Administrador"
                        : "Usuario"}
                    </td>

                    </tr>
                ))}

                </tbody>
            </table>
            </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Cartas base</h2>

            <Link
                to="/admin/products/new"
                className="btn"
                style={{
                backgroundColor: "#d4af37",
                border: "1px solid #d4af37",
                color: "#000",
                fontWeight: 600
                }}
            >
                Nueva carta
            </Link>
        </div>

        {products.length === 0 ? (
            <div className="alert alert-info">
            No hay cartas creadas.
            </div>
        ) : (
            <div className="table-responsive">
            <table className="table table-dark table-bordered align-middle">

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

                    <td>
                        {p.destacado ? "Sí" : "No"}
                    </td>

                    <td className="text-end">

                        <Link
                        to={`/admin/products/edit/${p.id}`}
                        className="btn btn-sm btn-outline-warning me-2"
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