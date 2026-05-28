import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchFavoritesByUserId, removeFavorite } from "../data/productsApi.js";
import { useAuth } from "../auth/useAuth.js";

export default function Favorites() {
const { user, loading: authLoading } = useAuth();
const [favorites, setFavorites] = useState([]);
const [loading, setLoading] = useState(true);

async function loadFavorites() {
    try {
        if (!user) return;

        const data = await fetchFavoritesByUserId(user.uid);
        setFavorites(data);
        } catch (err) {
        console.error("Error cargando favoritos:", err);
        } finally {
        setLoading(false);
        }
}

    useEffect(() => {
        if (!authLoading) {
        loadFavorites();
        }
    }, [user, authLoading]);

    async function handleRemove(favoriteId) {
        const ok = window.confirm("¿Quieres quitar esta carta de favoritos?");
        if (!ok) return;

        await removeFavorite(favoriteId);
        await loadFavorites();
    }

    if (authLoading || loading) {
        return (
        <div className="container-fluid py-4 text-light">
            Cargando favoritos...
        </div>
        );
    }

    if (!user) {
        return (
        <div className="container-fluid py-4">
            <div className="alert alert-warning">
            Debes iniciar sesión para ver tus favoritos.
            </div>

            <Link
            to="/login"
            className="btn"
            style={{
                backgroundColor: "#d4af37",
                border: "1px solid #d4af37",
                color: "#000",
                fontWeight: 600
            }}
            >
            Iniciar sesión
            </Link>
        </div>
        );
    }

    return (
        <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="text-light fw-bold">Mis favoritos</h1>

            <span
            className="badge fs-6"
            style={{
                backgroundColor: "#d4af37",
                color: "#000"
            }}
            >
            {favorites.length} cartas
            </span>
        </div>

        {favorites.length === 0 ? (
            <div className="alert alert-info">
            Todavía no tienes cartas favoritas.
            </div>
        ) : (
            <div className="row g-4">
            {favorites.map((fav) => (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={fav.id}>
                <div
                    className="card h-100 shadow-sm position-relative"
                    style={{
                    backgroundColor: "#212529",
                    border: "1px solid #343a40",
                    borderRadius: "12px",
                    overflow: "hidden"
                    }}
                >
                    <div
                    style={{
                        height: 320,
                        overflow: "hidden",
                        background: "#121212"
                    }}
                    >
                    <img
                        src={fav.productImage}
                        alt={fav.productName}
                        className="w-100 h-100"
                        style={{
                        objectFit: "contain",
                        padding: 10
                        }}
                    />
                    </div>

                    <button
                    onClick={() => handleRemove(fav.id)}
                    className="btn border rounded-circle position-absolute shadow-sm"
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

                        backgroundColor: "#212529",
                        borderColor: "#212529",
                        color: "#ff4d6d"
                    }}
                    >
                        💔
                    </button>

                    <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-light fw-bold">
                        {fav.productName}
                    </h5>

                    <p className="text-secondary mb-3">
                        {fav.categoria}
                    </p>

                    <Link
                        to={`/product/${fav.productId}`}
                        className="btn mt-auto"
                        style={{
                        backgroundColor: "#d4af37",
                        border: "1px solid #d4af37",
                        color: "#000",
                        fontWeight: 600
                        }}
                    >
                        Ver carta
                    </Link>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
    );
}