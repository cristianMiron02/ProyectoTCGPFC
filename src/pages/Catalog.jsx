import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard.jsx'

export default function Catalog(){
    const[searchParams] = searchParams();
    const q = (searchParams.get("q") || "").trim().toLowerCase();

    const filtered = useMemo(() => {
        if(!q) return products;

        return products.filter((p) => {
            const nombre = (p.nombre || "").toLowerCase();
            const descripcion = (p.descripcion || "").toLowerCase();
            return nombre.includes(q) || descripcion.includes(q);
        });
    }, [q]);

    return(
        <div className = "container py-4">
            <div className = "d-flex align-items-center mb-3">
                <h1 className = "mb-0">Productos</h1>
                <small className = "text-muted">
                    {q ? (
                        <>Resultados para: <strong>{q}</strong> ({filtered.length})</>
                    ) : (
                        <>Total: {products.length}</>
                    )}
                </small>
            </div>

            {filtered.length === 0 ? (
                <div className="alert alert-warning">
                    No se encontraron productos con ese texto.
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