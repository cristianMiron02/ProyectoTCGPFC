import { useEffect, useState } from "react";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    serverTimestamp
} from "firebase/firestore";

import { db } from "../firebase/firebase.js";
import { useAuth } from "../auth/useAuth.js";

const emptyForm = {
    nombre: "",
    categoria: "",
    descripcion: "",
    imagen: "",
    fecha: "",
    destacado: false
};

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();

    const [isAdmin, setIsAdmin] = useState(false);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);

    const [totalUsers, setTotalUsers] = useState(0);
    const [totalOffers, setTotalOffers] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);

    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [message, setMessage] = useState("");

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

    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
        }));
    }

    function handleNewProduct() {
        setEditingProductId(null);
        setForm(emptyForm);
        setShowForm(true);
        setMessage("");
    }

    function handleEditProduct(product) {
        setEditingProductId(product.id);

        setForm({
        nombre: product.nombre || "",
        categoria: product.categoria || "",
        descripcion: product.descripcion || "",
        imagen: product.imagen || "",
        fecha: product.fecha || "",
        destacado: Boolean(product.destacado)
        });

        setShowForm(true);
        setMessage("");
    }

    function handleCancelForm() {
        setEditingProductId(null);
        setForm(emptyForm);
        setShowForm(false);
        setMessage("");
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!form.nombre.trim()) {
        alert("El nombre de la carta es obligatorio.");
        return;
        }

        if (!form.categoria.trim()) {
        alert("La categoría es obligatoria.");
        return;
        }

        if (!form.imagen.trim()) {
        alert("La imagen es obligatoria.");
        return;
        }

        try {
        const productData = {
            nombre: form.nombre.trim(),
            categoria: form.categoria.trim(),
            descripcion: form.descripcion.trim(),
            imagen: form.imagen.trim(),
            fecha: form.fecha.trim(),
            destacado: form.destacado
        };

        if (editingProductId) {
            await updateDoc(doc(db, "products", editingProductId), {
            ...productData,
            updatedAt: serverTimestamp()
            });

            setMessage("Carta actualizada correctamente.");
        } else {
            await addDoc(collection(db, "products"), {
            ...productData,
            createdAt: serverTimestamp()
            });

            setMessage("Carta creada correctamente.");
        }

        setEditingProductId(null);
        setForm(emptyForm);
        setShowForm(false);
        await loadAdminData();
        } catch (err) {
        console.error("Error guardando carta:", err);
        alert("No se pudo guardar la carta.");
        }
    }

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
            <div className="alert alert-warning">Debes iniciar sesión.</div>
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

        {message && (
            <div className="alert alert-success">
            {message}
            </div>
        )}

        <div className="row g-4 mb-5">
            <div className="col-12 col-md-4">
            <div className="card bg-dark text-white border-secondary shadow h-100">
                <div className="card-body">
                <h5 className="text-warning">Usuarios</h5>
                <div className="display-5 fw-bold">{totalUsers}</div>
                </div>
            </div>
            </div>

            <div className="col-12 col-md-4">
            <div className="card bg-dark text-white border-secondary shadow h-100">
                <div className="card-body">
                <h5 className="text-warning">Ofertas</h5>
                <div className="display-5 fw-bold">{totalOffers}</div>
                </div>
            </div>
            </div>

            <div className="col-12 col-md-4">
            <div className="card bg-dark text-white border-secondary shadow h-100">
                <div className="card-body">
                <h5 className="text-warning">Ventas</h5>
                <div className="display-5 fw-bold">{totalOrders}</div>
                </div>
            </div>
            </div>
        </div>

        <h2 className="mb-3">Usuarios registrados</h2>

        {users.length === 0 ? (
            <div className="alert alert-info">No hay usuarios registrados.</div>
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
                        {u.username || `${u.nombre || ""} ${u.apellidos || ""}`}
                    </td>
                    <td>{u.email}</td>
                    <td>
                        {u.tipoCuenta === "buyer" && "Comprador"}
                        {u.tipoCuenta === "seller" && "Vendedor"}
                        {u.tipoCuenta === "both" && "Comprador/Vendedor"}
                        {!u.tipoCuenta && "-"}
                    </td>
                    <td>{u.nacionalidad || "-"}</td>
                    <td>{u.role === "admin" ? "Administrador" : "Usuario"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Cartas base</h2>

            <button
            className="btn"
            onClick={handleNewProduct}
            style={{
                backgroundColor: "#d4af37",
                border: "1px solid #d4af37",
                color: "#000",
                fontWeight: 600
            }}
            >
            Nueva carta
            </button>
        </div>

        {showForm && (
            <div className="card bg-dark text-white border-secondary mb-4">
            <div className="card-body">
                <h4 className="mb-4">
                {editingProductId ? "Editar carta" : "Crear nueva carta"}
                </h4>

                <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-12 col-md-6">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        className="form-control"
                        value={form.nombre}
                        onChange={handleChange}
                        placeholder="Ej: Charizard EX"
                    />
                    </div>

                    <div className="col-12 col-md-6">
                    <label className="form-label">Categoría</label>
                    <select
                        name="categoria"
                        className="form-select"
                        value={form.categoria}
                        onChange={handleChange}
                    >
                        <option value="">Selecciona categoría</option>
                        <option value="Pokémon">Pokémon</option>
                        <option value="One Piece">One Piece</option>
                        <option value="Gundam">Gundam</option>
                        <option value="Magic">Magic</option>
                        <option value="Yu-Gi-Oh">Yu-Gi-Oh</option>
                    </select>
                    </div>

                    <div className="col-12 col-md-6">
                    <label className="form-label">Año</label>
                    <input
                        type="text"
                        name="fecha"
                        className="form-control"
                        value={form.fecha}
                        onChange={handleChange}
                        placeholder="Ej: 2025"
                    />
                    </div>

                    <div className="col-12 col-md-6">
                    <label className="form-label">URL de imagen</label>
                    <input
                        type="text"
                        name="imagen"
                        className="form-control"
                        value={form.imagen}
                        onChange={handleChange}
                        placeholder="https://..."
                    />
                    </div>

                    <div className="col-12">
                    <label className="form-label">Descripción</label>
                    <textarea
                        name="descripcion"
                        className="form-control"
                        rows="3"
                        value={form.descripcion}
                        onChange={handleChange}
                        placeholder="Descripción de la carta"
                    />
                    </div>

                    <div className="col-12">
                    <div className="form-check">
                        <input
                        type="checkbox"
                        name="destacado"
                        className="form-check-input"
                        checked={form.destacado}
                        onChange={handleChange}
                        id="destacado"
                        />
                        <label className="form-check-label" htmlFor="destacado">
                        Marcar como carta destacada
                        </label>
                    </div>
                    </div>

                    {form.imagen && (
                    <div className="col-12">
                        <p className="mb-2">Vista previa:</p>
                        <img
                        src={form.imagen}
                        alt="Vista previa"
                        style={{
                            width: 120,
                            height: 160,
                            objectFit: "contain",
                            backgroundColor: "#212529",
                            border: "1px solid #343a40",
                            borderRadius: 8
                        }}
                        />
                    </div>
                    )}

                    <div className="col-12 d-flex gap-2">
                    <button
                        type="submit"
                        className="btn"
                        style={{
                        backgroundColor: "#d4af37",
                        border: "1px solid #d4af37",
                        color: "#000",
                        fontWeight: 600
                        }}
                    >
                        {editingProductId ? "Actualizar carta" : "Guardar carta"}
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline-light"
                        onClick={handleCancelForm}
                    >
                        Cancelar
                    </button>
                    </div>
                </div>
                </form>
            </div>
            </div>
        )}

        {products.length === 0 ? (
            <div className="alert alert-info">No hay cartas creadas.</div>
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
                    <td>{p.destacado ? "Sí" : "No"}</td>

                    <td className="text-end">
                        <button
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => handleEditProduct(p)}
                        >
                        Editar
                        </button>

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