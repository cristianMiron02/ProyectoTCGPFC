import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

import { db } from "../firebase/firebase.js";
import {
  fetchProductById,
  fetchOffersByProductId,
  fetchOrdersByProductId
} from "../data/productsApi.js";

import { useAuth } from "../auth/useAuth.js";
import { useCart } from "../cart/CartContext.jsx";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function getFlagUrl(country) {
  switch (country) {
    case "España":
    case "Español":
      return "https://flagcdn.com/w40/es.png";

    case "Portugal":
    case "Portugués":
      return "https://flagcdn.com/w40/pt.png";

    case "Francia":
    case "Francés":
      return "https://flagcdn.com/w40/fr.png";

    case "Italia":
    case "Italiano":
      return "https://flagcdn.com/w40/it.png";

    case "Alemania":
    case "Alemán":
      return "https://flagcdn.com/w40/de.png";

    case "Reino Unido":
    case "Inglés":
      return "https://flagcdn.com/w40/gb.png";

    case "Estados Unidos":
      return "https://flagcdn.com/w40/us.png";

    case "Japón":
    case "Japonés":
      return "https://flagcdn.com/w40/jp.png";

    default:
      return "";
  }
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [offers, setOffers] = useState([]);
  const [tipoCuenta, setTipoCuenta] = useState(null);
  const [offerQty, setOfferQty] = useState({});
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      setLoading(true);

      const p = await fetchProductById(id);
      setProduct(p);

      const productOffers = await fetchOffersByProductId(id);
      setOffers(productOffers);

      const orders = await fetchOrdersByProductId(id);

      const grouped = {};

      orders.forEach((order) => {
        const day = new Date(order.createdAt).toLocaleDateString("es-ES", {
          weekday: "short"
        });

        if (!grouped[day]) {
          grouped[day] = {
            dia: day,
            ventas: 0,
            ingresos: 0
          };
        }

        grouped[day].ventas += Number(order.qty);
        grouped[day].ingresos += Number(order.total);
      });

      setSalesData(Object.values(grouped));

      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setTipoCuenta(userSnap.data().tipoCuenta);
        }
      } else {
        setTipoCuenta(null);
      }
    } catch (err) {
      console.error("Error cargando producto, ofertas o ventas:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) loadData();
  }, [id, user]);

  async function handleDeleteOffer(offerId) {
    const ok = window.confirm("¿Seguro que quieres borrar esta oferta?");
    if (!ok) return;

    try {
      await deleteDoc(doc(db, "offers", offerId));
      await loadData();
    } catch (err) {
      console.error("Error borrando oferta:", err);
      alert("No se pudo borrar la oferta.");
    }
  }

  function handleQtyChange(offer, value) {
    let qty = Number(value);

    if (!Number.isFinite(qty) || qty < 1) {
      qty = 1;
    }

    if (qty > Number(offer.stock)) {
      qty = Number(offer.stock);
    }

    setOfferQty((prev) => ({
      ...prev,
      [offer.id]: qty
    }));
  }

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
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="mb-0">Ofertas disponibles</h2>

          {(tipoCuenta === "seller" || tipoCuenta === "both") && (
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/create-offer/${product.id}`)}
            >
              Crear oferta
            </button>
          )}
        </div>

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
                  <th>Nacionalidad</th>
                  <th>Idioma</th>
                  <th>Estado</th>
                  <th className="text-end">Precio</th>
                  <th className="text-center">Stock</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {offers.map((offer) => {
                  const isOwner = user && user.uid === offer.sellerId;
                  const stock = Number(offer.stock);
                  const qty = offerQty[offer.id] || 1;

                  return (
                    <tr key={offer.id}>
                      <td>{offer.sellerName || "-"}</td>

                      <td className="text-center">
                        {getFlagUrl(offer.sellerNationality) ? (
                          <img
                            src={getFlagUrl(offer.sellerNationality)}
                            alt={offer.sellerNationality}
                            style={{
                              width: 28,
                              height: 20,
                              objectFit: "cover",
                              borderRadius: 2
                            }}
                          />
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="text-center">
                        {getFlagUrl(offer.idiomaCarta) ? (
                          <img
                            src={getFlagUrl(offer.idiomaCarta)}
                            alt={offer.idiomaCarta}
                            style={{
                              width: 28,
                              height: 20,
                              objectFit: "cover",
                              borderRadius: 2
                            }}
                          />
                        ) : (
                          "-"
                        )}
                      </td>

                      <td>{offer.estado || "-"}</td>

                      <td className="text-end">
                        {Number(offer.precio).toLocaleString("es-ES")} €
                      </td>

                      <td className="text-center">{offer.stock}</td>

                      <td className="text-center">
                        {stock > 1 ? (
                          <input
                            type="number"
                            className="form-control form-control-sm text-center"
                            style={{
                              width: 80,
                              marginLeft: "auto",
                              marginRight: "auto"
                            }}
                            min="1"
                            max={stock}
                            value={qty}
                            onChange={(e) =>
                              handleQtyChange(offer, e.target.value)
                            }
                          />
                        ) : (
                          <span>1</span>
                        )}
                      </td>

                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          {user ? (
                            <button
                              className="btn btn-sm btn-success"
                              disabled={stock <= 0}
                              onClick={() =>
                                addToCart(
                                  {
                                    ...product,
                                    precio: Number(offer.precio),
                                    offerId: offer.id,
                                    sellerId: offer.sellerId,
                                    sellerName: offer.sellerName,
                                    sellerNationality: offer.sellerNationality,
                                    idiomaCarta: offer.idiomaCarta,
                                    estado: offer.estado
                                  },
                                  qty
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

                          {isOwner && (
                            <>
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() =>
                                  navigate(`/edit-offer/${offer.id}`)
                                }
                              >
                                Editar
                              </button>

                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteOffer(offer.id)}
                              >
                                Borrar
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-5">
        <h2 className="mb-3">Estadísticas de ventas</h2>

        {salesData.length === 0 ? (
          <div className="alert alert-secondary">
            Todavía no hay ventas registradas para esta carta.
          </div>
        ) : (
          <>
            <div className="p-4 border rounded-3 mb-4">
              <h5>Unidades vendidas por día</h5>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ventas" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-4 border rounded-3">
              <h5>Ingresos por día (€)</h5>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="ingresos" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}