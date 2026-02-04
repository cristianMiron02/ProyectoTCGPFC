import { Link } from 'react-router-dom'

export default function cardProductos({ products}) {
    return(
        <div class = "card h-100 shadow-sm">
            <img src = {products.imagen} className = "card-img-top" alt = {products.nombre}></img>
            <div className = "card-body d-flex flew-column">
                <h5 className = "card-title">{products.nombre}</h5>
                <p className = "card-text mb-2">{products.categoria}</p>
                <p className = "fw-bold mb-3">{products.precio} €</p>

                <Link to={`/product/${product.id}`} className="btn btn-primary mt-auto">
                    Ver producto
                </Link>
            </div>
        </div>
    );
} 