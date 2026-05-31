import { Link } from "react-router-dom";
import { addFavorite } from "../data/productsApi.js";
import { useAuth } from "../auth/useAuth.js";

export default function ProductCard({ product }) {
    const { user } = useAuth();

    async function handleFavorite() {
        if (!user) {
            alert("Debes iniciar sesión para añadir favoritos.");
            return;
        }

        await addFavorite(user.uid, product);
        alert("Añadido a favoritos.");
    }

    return (
        <div className="card h-100 shadow-sm bg-dark text-white border-secondary position-relative">
            <div style={{ height: "250px", overflow: "hidden" }}>
                <img
                    src={product.imagen}
                    className="card-img-top w-100 h-100"
                    alt={product.nombre}
                    style={{ objectFit: "contain" }}
                />
            </div>

            <div className="card-body d-flex flex-column">
                <h5
                    className="card-title"
                    style={{
                        minHeight: "32px"
                    }}
                >
                    {product.nombre}
                </h5>

                <p className="card-text mb-3">
                    {product.categoria}
                </p>

                <Link
                    to={`/product/${product.id}`}
                    className="btn mt-auto"
                    style={{
                        backgroundColor: "#d4af37",
                        borderColor: "#d4af37",
                        color: "#000"
                    }}
                >
                    Ver ofertas
                </Link>

                <button
                    onClick={handleFavorite}
                    className="rounded-circle position-absolute"
                    style={{
                        top: 10,
                        right: 10,
                        width: 42,
                        height: 42,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.2rem",
                        zIndex: 10,
                        backgroundColor: "#23272b",
                        border: "1px solid #d4af37",
                        color: "#ff4d6d"
                    }}
                >
                    ❤️
                </button>
            </div>
        </div>
    );
}