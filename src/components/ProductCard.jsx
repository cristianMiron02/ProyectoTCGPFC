import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
    return (
        <div className="card h-100 shadow-sm">

            <div style={{ height: "250px", overflow: "hidden" }}>
                <img
                    src={product.imagen}
                    className="card-img-top w-100 h-100"
                    alt={product.nombre}
                    style={{ objectFit: "contain", backgroundColor: "#fff" }}
                />
            </div>


            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.nombre}</h5>
                <p className="card-text mb-2">{product.categoria}</p>
                <p className="fw-bold mb-3">{product.precio} €</p>

                <Link to={`/product/${product.id}`} className="btn btn-primary mt-auto">
                    Ver producto
                </Link>
            </div>
        </div>
    );
}
