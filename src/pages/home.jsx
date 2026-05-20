import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../data/productsApi.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProducts() {
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (err) {
            console.error("Error cargando productos destacados:", err);
        } finally {
            setLoading(false);
        }
        }

        loadProducts();
    }, []);

    const destacados = products.filter((p) => p.destacado).slice(0, 8);

    return (
        <div className="container-fluid px-0">
        <div id="homeCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
            <div className="carousel-item active">
                <div
                className="d-flex flex-column justify-content-center align-items-center text-center"
                style={{
                    height: "450px",
                    background: "linear-gradient(to bottom, #666666, #666666)"
                }}
                >
                <h1 className="fw-bold" style={{ fontSize: "4rem", color: "#d4af37" }}>
                    The God Cards
                </h1>

                <p className="fs-4 text-light">
                    Compra y vende cartas TCG
                </p>

                <Link to="/catalog" className="btn btn-gold btn-lg mt-3">
                    Ver catálogo
                </Link>
                </div>
            </div>

            <div className="carousel-item">
                <div
                className="d-flex flex-column justify-content-center align-items-center text-center"
                style={{
                    height: "450px",
                    background: "linear-gradient(to bottom, #111111, #1a1a1a)"
                }}
                >
                <h1 className="fw-bold" style={{ fontSize: "4rem", color: "#d4af37" }}>
                    Marketplace TCG
                </h1>

                <p className="fs-4 text-light">
                    Encuentra cartas únicas
                </p>
                </div>
            </div>

            <div className="carousel-item">
                <div
                className="d-flex flex-column justify-content-center align-items-center text-center"
                style={{
                    height: "450px",
                    background: "linear-gradient(to bottom, #666666, #666666)"
                }}
                >
                <h1 className="fw-bold" style={{ fontSize: "4rem", color: "#d4af37" }}>
                    Compra y vende
                </h1>

                <p className="fs-4 text-light">
                    Sistema de ofertas entre usuarios
                </p>
                </div>
            </div>
            </div>

            <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide="prev"
            >
            <span className="carousel-control-prev-icon"></span>
            </button>

            <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide="next"
            >
            <span className="carousel-control-next-icon"></span>
            </button>
        </div>

        <div className="container-fluid py-5 px-4">
            <div className="d-flex align-items-center mb-3">
            <h2 className="mb-0 text-white">Productos destacados</h2>

            <small className="text-muted ms-3">
                Mostrando {destacados.length} productos
            </small>
            </div>

            {loading ? (
            <div className="text-white">Cargando destacados...</div>
            ) : destacados.length === 0 ? (
            <div className="alert alert-info">
                No hay productos destacados.
            </div>
            ) : (
            <div className="row g-3">
                {destacados.map((p) => (
                <div className="col-12 col-sm-6 col-lg-3" key={p.id}>
                    <ProductCard product={p} />
                </div>
                ))}
            </div>
            )}
        </div>
        </div>
    );
}