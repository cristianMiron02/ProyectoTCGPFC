import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer
        className="mt-5 pt-4 pb-3"
        style={{
            backgroundColor: "#111111",
            borderTop: "1px solid #d4af37"
        }}
        >
        <div className="container">
            <div className="row gy-4 align-items-center">
            
            <div className="col-12 col-md-4 text-center text-md-start">
                <h5
                className="fw-bold mb-2"
                style={{ color: "#d4af37" }}
                >
                The God Cards
                </h5>
                <p className="mb-0 small text-secondary">
                Marketplace de compra y venta de cartas TCG.
                </p>
            </div>

            <div className="col-12 col-md-4 text-center">
                <Link to="/" className="text-secondary text-decoration-none mx-2">
                Inicio
                </Link>
                <Link to="/catalog" className="text-secondary text-decoration-none mx-2">
                Catálogo
                </Link>
                <Link to="/favorites" className="text-secondary text-decoration-none mx-2">
                Favoritos
                </Link>
                <Link to="/cart" className="text-secondary text-decoration-none mx-2">
                Carrito
                </Link>
            </div>

            <div className="col-12 col-md-4 text-center text-md-end">
                <p className="mb-1 small text-secondary">
                Proyecto Final DAW
                </p>
                <p className="mb-0 small text-secondary">
                © 2026 The God Cards
                </p>
            </div>

            </div>
        </div>
        </footer>
    );
}