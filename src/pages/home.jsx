import ProductCard  from "../components/ProductCard.jsx";
import { products } from "../data/products.js";

export default function Home(){

const destacado = products.filter((p) => p.destacado).slice(0, 8);

return(
    <>
    <div className = "container py-4">

        <div className = "row g-4 align-items-stretch">
            <div className = "col-12 col-lg-7">
                <div className = "p-4 border rounded-3 h-100">
                    <h1 className = "mb-3">Bienvenido a mi tienda</h1>
                    <p className = "text-muted">
                        Una tienda dedicada a la venta de coches, motos y partes de estos.
                    </p>
                </div>
            </div>
        </div>

        <div className = "mt-5">
            <div className = "d-flex align-items-center mb-3">
                <h2 className = "mb-0">Productos destacados</h2>
                <small className = "text-muted">Mostrando {destacado.length} productos</small>
            </div>
            <div className = "row g-3">
                {destacado.map((p) => (
                    <div className = "col-12 col-sm-6 col-lg-3" key = {p.id}> 
                        <ProductCard product = {p}/>
                    </div>
                ))}
            </div>
        </div>
    </div>
    </>
    ); 
}