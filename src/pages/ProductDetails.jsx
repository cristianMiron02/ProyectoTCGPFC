    import { useParams, Link, useNavigate } from "react-router-dom";
    import { products } from "../data/products.js";
    import { isLoggedIn } from "../auth/auth.js";
    import { useCart } from "../cart/CartContext.jsx";

    export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { addToCart } = useCart();

    const product = products.find((p) => String(p.id) === String(id));
    const logged = isLoggedIn();

    if (!product) {
        return (
        <div className="container py-4">
            <h1>Producto no encontrado</h1>
            <Link to="/" className="btn btn-outline-primary mt-2">
            Volver al inicio
            </Link>
        </div>
        );
    }

    return (
        <div className="container py-4">
        <Link to="/" className="text-decoration-none">
            ← Volver
        </Link>

        <div className="row g-4 mt-2">
            <div className="col-12 col-lg-6">
            <img
                src={product.imagen || "https://picsum.photos/seed/noimage/900/600"}
                alt={product.nombre}
                className="img-fluid rounded"
                style={{ objectFit: "cover" }}
            />
            </div>

            <div className="col-12 col-lg-6">
            <h1>{product.nombre}</h1>
            <div className="text-muted">
                {product.categoria} · Año {product.fecha}
            </div>

            <p className="mt-3">
                {product.descripcion?.trim() ? product.descripcion : "Sin descripción."}
            </p>

            <div className="fs-4 fw-bold">
                {Number(product.precio).toLocaleString("es-ES")} €
            </div>

            <div className="mt-3">
                {logged ? (
                <button
                    className="btn btn-success"
                    onClick={() => addToCart(product, 1)}
                >
                    Añadir al carrito
                </button>
                ) : (
                <button
                    className="btn btn-warning"
                    onClick={() => navigate("/login")}
                >
                    Iniciar sesión para comprar
                </button>
                )}
            </div>
            </div>
        </div>
        </div>
    );
    }
