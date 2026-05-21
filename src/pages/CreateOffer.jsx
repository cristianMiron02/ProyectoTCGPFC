    import { useEffect, useState } from "react";
    import { useNavigate, useParams, Link } from "react-router-dom";
    import { addDoc, collection, doc, getDoc } from "firebase/firestore";

    import { db } from "../firebase/firebase.js";
    import { useAuth } from "../auth/useAuth.js";
    import { fetchProductById } from "../data/productsApi.js";

    export default function CreateOffer() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    const [product, setProduct] = useState(null);
    const [tipoCuenta, setTipoCuenta] = useState("");
    const [sellerName, setSellerName] = useState("");
    const [sellerNationality, setSellerNationality] = useState("");

    const [estado, setEstado] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [idiomaCarta, setIdiomaCarta] = useState("");
    const [gradoCarta, setGradoCarta] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const canSell = tipoCuenta === "seller" || tipoCuenta === "both";

    useEffect(() => {
        async function load() {
        try {
            if (!productId) {
            setError("No se ha encontrado la carta.");
            return;
            }

            const p = await fetchProductById(productId);
            setProduct(p);

            if (!p) {
            setError("La carta no existe.");
            return;
            }

            if (!user) {
            setLoading(false);
            return;
            }

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
            setError("No existe el perfil del usuario en Firestore.");
            return;
            }

            const data = userSnap.data();

            setTipoCuenta(data.tipoCuenta || "");
            setSellerName(data.username || data.nombre || user.email);
            setSellerNationality(data.nacionalidad || "");

            console.log("Perfil usuario:", data);
        } catch (err) {
            console.error("Error cargando datos:", err);
            setError("Error cargando los datos.");
        } finally {
            setLoading(false);
        }
        }

        if (!authLoading) load();
    }, [productId, user, authLoading]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!user) {
        setError("Debes iniciar sesión para crear una oferta.");
        return;
        }

        if (!canSell) {
        setError(
            "Solo los usuarios vendedores o compradores/vendedores pueden crear ofertas."
        );
        return;
        }

        if (!productId || !product) {
        setError("No se ha encontrado la carta.");
        return;
        }

        if (!estado.trim() || !idiomaCarta.trim() || !precio || !stock) {
        setError("Completa todos los campos.");
        return;
        }

        if (Number(precio) <= 0) {
        setError("El precio debe ser mayor que 0.");
        return;
        }

        if (Number(stock) <= 0) {
        setError("El stock debe ser mayor que 0.");
        return;
        }

        if (estado === "Gradeada" && !gradoCarta) {
            setError("Selecciona el grado de la carta.");
            return;
        }

        try {
        await addDoc(collection(db, "offers"), {
            productId,
            productName: product.nombre,

            sellerId: user.uid,
            sellerEmail: user.email,
            sellerName: sellerName || user.email,
            sellerNationality: sellerNationality || "No indicada",

            estado,
            gradoCarta: estado === "Gradeada" ? gradoCarta : "",
            idiomaCarta,

            precio: Number(precio),
            stock: Number(stock),

            createdAt: new Date().toISOString()
        });

        navigate(`/product/${productId}`);
        } catch (err) {
        console.error("Error creando oferta:", err);
        setError("No se pudo crear la oferta. Revisa permisos de Firestore.");
        }
    }

    if (authLoading || loading) {
        return <div className="container-fluid py-4">Cargando...</div>;
    }

    if (!user) {
        return (
        <div className="container-fluid py-4">
            <div className="alert alert-warning">
            Debes iniciar sesión para crear una oferta.
            </div>
            <Link to="/login" className="btn btn-primary">
            Iniciar sesión
            </Link>
        </div>
        );
    }

    if (!canSell) {
        return (
        <div className="container-fluid py-4">
            <div className="alert alert-danger">
            No tienes permisos para crear ofertas. Tu tipo de cuenta actual es:{" "}
            <strong>{tipoCuenta || "sin definir"}</strong>
            </div>

            <p className="text-muted">
            Para crear ofertas, la cuenta debe ser de tipo vendedor o
            comprador/vendedor.
            </p>

            <Link to="/catalog" className="btn btn-outline-primary">
            Volver al catálogo
            </Link>
        </div>
        );
    }

    return (
        <div className="container-fluid py-4">
        <Link to={`/product/${productId}`} className="text-decoration-none">
            ← Volver a la carta
        </Link>

        <div className="p-4 border rounded-3 mt-3">
            <h1 className="mb-3">Crear oferta</h1>

            {product && (
            <p className="text-muted">
                Carta: <strong>{product.nombre}</strong>
            </p>
            )}

            <p className="text-muted small">
            Vendedor: <strong>{sellerName}</strong> | Nacionalidad:{" "}
            <strong>{sellerNationality || "No indicada"}</strong>
            </p>

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
                <option value="Gradeada">Gradeada</option>
                <option value="Nueva">Nueva</option>
                <option value="Casi nueva">Casi Nueva</option>
                <option value="Rota">Rota</option>
                <option value="Jugada">Jugada</option>
                </select>

                {estado === "Gradeada" && (
                    <div className="mb-3">
                        <label className="form-label">Grado</label>

                        <select
                        className="form-select"
                        value={gradoCarta}
                        onChange={(e) => setGradoCarta(e.target.value)}
                        >
                        <option value="">Selecciona grado</option>

                        <option value="PSA 10">PSA 10</option>
                        <option value="PSA 9">PSA 9</option>
                        <option value="PSA 8">PSA 8</option>

                        <option value="BGS 10">BGS 10</option>
                        <option value="BGS 9.5">BGS 9.5</option>

                        <option value="CGC 10">CGC 10</option>
                        <option value="CGC 9.5">CGC 9.5</option>
                        </select>
                    </div>
                )}
            </div>

            <div className="mb-3">
                <label className="form-label">Idioma de la carta</label>
                <select
                className="form-select"
                value={idiomaCarta}
                onChange={(e) => setIdiomaCarta(e.target.value)}
                >
                <option value="">Selecciona idioma</option>
                <option value="España">Español</option>
                <option value="Reino Unido">Inglés</option>
                <option value="Japón">Japonés</option>
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
                placeholder="Ej: 24.99"
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Stock</label>
                <input
                type="number"
                className="form-control"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="1"
                step="1"
                placeholder="Ej: 2"
                />
            </div>

            <button className="btn btn-primary" type="submit">
                Crear oferta
            </button>
            </form>
        </div>
        </div>
    );
    }