import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProductById } from "../data/productsApi.js";
import { useCart } from "../cart/CartContext.jsx";
import { useAuth } from "../auth/useAuth.js";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const p = await fetchProductById(id);
        setProduct(p);
      } catch (e) {
        console.error("Error cargando producto:", e);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return <div className="container py-4">Cargando producto...</div>;
  }

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

  const logged = !!user;

  return (
    <div className="container py-4">
      <Link to="/catalog" className="text-decoration-none">
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
            {product.categoria} {product.fecha ? `· Año ${product.fecha}` : ""}
          </div>

          <p className="mt-3">
            {product.descripcion?.trim() ? product.descripcion : "Sin descripción."}
          </p>

          <div className="fs-4 fw-bold">
            {Number(product.precio).toLocaleString("es-ES")} €
          </div>

          <div className="mt-3">
            {!authLoading && logged ? (
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
