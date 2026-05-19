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
        return <div className="container-fluid py-4">Cargando favoritos...</div>;
    }

    if (!user) {
        return (
        <div className="container-fluid py-4">
            <div className="alert alert-warning">
            Debes iniciar sesión para ver tus favoritos.
            </div>

            <Link to="/login" className="btn btn-primary">
            Iniciar sesión
            </Link>
        </div>
        );
    }

    return (
        <div className="container-fluid py-4">
        <h1 className="mb-4">Mis favoritos</h1>

        {favorites.length === 0 ? (
            <div className="alert alert-info">
            Todavía no tienes cartas favoritas.
            </div>
        ) : (
            <div className="row g-3">
            {favorites.map((fav) => (
                <div className="col-12 col-sm-6 col-lg-3" key={fav.id}>
                <div className="card h-100 shadow-sm">
                    <div style={{ height: 220, overflow: "hidden" }}>
                    <img
                        src={fav.productImage}
                        alt={fav.productName}
                        className="card-img-top w-100 h-100"
                        style={{ objectFit: "contain" }}
                    />
                    </div>

                    <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{fav.productName}</h5>
                    <p className="text-muted">{fav.categoria}</p>

                    <Link
                        to={`/product/${fav.productId}`}
                        className="btn btn-primary mt-auto"
                    >
                        Ver carta
                    </Link>

                    <button
                        onClick={() => handleRemove(fav.id)}
                        className="btn btn-light border rounded-circle position-absolute"
                        style={{
                            top: 10,
                            right: 10,
                            width: 42,
                            height: 42,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.2rem",
                            zIndex: 10
                        }}
                    >
                        💔
                    </button>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
    );
}