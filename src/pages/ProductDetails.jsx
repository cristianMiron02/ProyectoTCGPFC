import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProductById, fetchOffersByProductId } from "../data/productsApi.js";
import { useCart } from "../cart/CartContext.jsx";
import { useAuth } from "../auth/useAuth.js";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [product, setProduct] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const p = await fetchProductById(id);
        setProduct(p);

        const productOffers = await fetchOffersByProductId(id);
        setOffers(productOffers);
      } catch (err) {
        console.error("Error cargando producto u ofertas:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  if (loading) {
    return <div className="container-fluid py-4">Cargando producto...</div>;
  }

  if (!product) {
    return (
      <div className="container-fluid py-4">
        <h1>Producto no encontrado</h1>
        <Link to="/catalog" className="btn btn-outline-primary mt-2">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const logged = !!user;

  return (
    <div className="container-fluid py-4">
      <Link to="/catalog" className="text-decoration-none">
        ← Volver al catálogo
      </Link>

      <div className="row g-4 mt-2">
        <div className="col-12 col-lg-5">
          <img
            src={product.imagen}
            alt={product.nombre}
            className="img-fluid rounded"
            style={{ maxHeight: 450, objectFit: "contain", width: "100%" }}
          />
        </div>

        <div className="col-12 col-lg-7">
          <h1>{product.nombre}</h1>

          <div className="text-muted">
            {product.categoria} {product.fecha ? `· Año ${product.fecha}` : ""}
          </div>

          <p className="mt-3">
            {product.descripcion?.trim()
              ? product.descripcion
              : "Sin descripción."}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="mb-3">Ofertas disponibles</h2>

        {offers.length === 0 ? (
          <div className="alert alert-info">
            No hay ofertas disponibles para esta carta.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead>
                <tr>
                  <th>Vendedor</th>
                  <th>Estado</th>
                  <th className="text-end">Precio</th>
                  <th className="text-center">Stock</th>
                  <th>Envío</th>
                  <th className="text-end">Acción</th>
                </tr>
              </thead>

              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.id}>
                    <td>{offer.sellerName}</td>
                    <td>{offer.estado}</td>
                    <td className="text-end">
                      {Number(offer.precio).toLocaleString("es-ES")} €
                    </td>
                    <td className="text-center">{offer.stock}</td>
                    <td>{offer.envio}</td>
                    <td className="text-end">
                      {logged ? (
                        <button
                          className="btn btn-sm btn-success"
                          disabled={Number(offer.stock) <= 0}
                          onClick={() =>
                            addToCart(
                              {
                                ...product,
                                precio: Number(offer.precio),
                                sellerName: offer.sellerName,
                                offerId: offer.id
                              },
                              1
                            )
                          }
                        >
                          Añadir al carrito
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => navigate("/login")}
                        >
                          Iniciar sesión
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {authLoading && (
          <div className="text-muted small mt-2">
            Comprobando sesión...
          </div>
        )}
      </div>
    </div>
  );
}