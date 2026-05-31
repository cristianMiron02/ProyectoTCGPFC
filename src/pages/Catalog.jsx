import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../data/productsApi.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

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
    return products.filter((p) => {
      const nombre = (p.nombre || "").toLowerCase();
      const descripcion = (p.descripcion || "").toLowerCase();

      const coincideBusqueda =
        !q || nombre.includes(q) || descripcion.includes(q);

      const coincideCategoria =
        !categoriaFiltro || p.categoria === categoriaFiltro;

      return coincideBusqueda && coincideCategoria;
    });
  }, [products, q, categoriaFiltro]);

  if (loading) {
    return <div className="container py-4">Cargando productos...</div>;
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex align-items-center mb-3">
        <h1 className="mb-0">Productos</h1>

        <small className="text-muted ms-3">
          {q ? (
            <>
              Resultados para: <strong>{q}</strong> ({filtered.length})
            </>
          ) : (
            <>Mostrando {filtered.length} de {products.length}</>
          )}
        </small>
      </div>

      <div className="row mb-4">
        <div className="col-12 col-md-4">
          <label className="form-label">Filtrar por categoría</label>

          <select
            className="form-select"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            <option value="Pokémon">Pokémon</option>
            <option value="One Piece">One Piece</option>
            <option value="Gundam">Gundam</option>
            <option value="Riftbound">Riftbound</option>
            <option value="Yu-Gi-Oh">Yu-Gi-Oh</option>
          </select>
        </div>
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