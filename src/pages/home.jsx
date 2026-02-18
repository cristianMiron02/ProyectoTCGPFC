import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { fetchProducts } from "../data/productsApi.js";

export default function Home() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (err) {
            console.error("Error cargando productos en Home:", err);
        } finally {
            setLoading(false);
        }
        }

        load();
    }, []);

    const destacado = useMemo(
        () => products.filter((p) => p.destacado).slice(0, 8),
        [products]
    );

    if (loading) {
        return <div className="container-fluid py-4">Cargando...</div>;
    }

    return (
        <div className="container-fluid py-4">

            <div className="row g-4 align-items-stretch">
                <div className="col-12">
                <div className="p-4 border rounded-3 text-center h-100">
                    <h1 className="mb-3">Bienvenido a mi tienda</h1>
                    <p className="text-muted text-center">
                    Una tienda dedicada a la venta de cartas coleccionables de Pokémon, One Piece, Gundam y Riftbound.
                    </p>
                </div>
                </div>
            </div>

            <div className="mt-5">
                <div className="d-flex align-items-center mb-3">
                    <h2 className="mb-0">Productos destacados</h2>
                    <small className="text-muted ms-3">
                        Mostrando {destacado.length} productos
                    </small>
                </div>

                {destacado.length === 0 ? (
                    <div className="alert alert-warning">
                        No hay productos destacados.
                    </div>
                ) : (
                    <div className="row g-3">
                        {destacado.map((p) => (
                            <div className="col-12 col-sm-6 col-lg-3" key={p.id}>
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
