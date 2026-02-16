import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../data/productsApi.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error cargando productos:", err);
      } finally {
        setLoading(false);
      }
    } 

    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    if (!q) return products;

    return products.filter((p) => {
      const nombre = (p.nombre || "").toLowerCase();
      const descripcion = (p.descripcion || "").toLowerCase();
      return nombre.includes(q) || descripcion.includes(q);
    });
  }, [products, q]);

  if (loading) {
    return <div className="container py-4">Cargando productos...</div>;
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex align-items-center mb-3">
        <h1 className="mb-0">Productos</h1>
          <small className="text-muted ms-3">
            {q ? (
              <>Resultados para: <strong>{q}</strong> ({filtered.length})</>
            ) : (
              <>Total: {products.length}</>
            )}
          </small>
      </div>

      {filtered.length === 0 ? (
        <div className="alert alert-warning">
          No se encontraron productos.
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map((p) => (
            <div className="col-12 col-sm-6 col-lg-3" key={p.id}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
