import { useParams, Link } from "react-router-dom";
import { products } from "../data/products";

export default function ProductDetails(){
    const { id } = useParams();
    const product = product.find((p) => String(p.id) == String(id));

    const isLoggedIn = false;

    if(!product) {
        return (
            <div>
                <h1>Producto no encontrado</h1>
                <Link to="/" className="btn btn-outline-primary mt-2">
                    Volver al inicio
                </Link>
            </div>
        );
    }

    return (
        <div>
            <Link to="/" className="text-decoration-none">
                Volver
            </Link>

            <div className="row g-4 mt-2">
                <div className="col-12 col-lg-6">
                    <img src={product.image} alt={product.name} className="img-fluid rounded" />
                </div>

                <div className="col-12 col-lg-6">
                    <h1>{product.name}</h1>
                    <div className="text-muted">{product.category}</div>
                    <p className="mt-3">{product.description}</p>
                    <div className="fs-4 fw-bold">{product.price.toFixed(2)} €</div>

                    <div className="mt-3">
                        {isLoggedIn ? (
                            <button className="btn btn-success">Añadir al carrito</button>
                        ) : (
                            <button className="btn btn-warning">Iniciar sesión para comprar</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}