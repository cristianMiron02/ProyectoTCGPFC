import { useCart } from "../cart/CartContext.jsx";

export default function Cart(){
    const { items, removeFromCart, setQty, total } = useCart();

    function confirmRemove(item){
        const ok = window.confirm(`¿Seguro que quieres eliminar "${item.nombre}"?`);
        if (ok) removeFromCart(item.id);
    }

    return (
        <div className = "container py-4">
            <h1 className = "mb-3"></h1>

            {items.length === 0 ? (
                <div className = "alert alert.info">Tu carrito está vacio.</div>
            ) : (
                <>
                    <div className = "table-responsive">
                        <table>
                            <thread>
                                <tr>
                                    <th>Producto</th>
                                    <th className = "text-center" style={{width: 180}}>Unidades</th>
                                    <th className = "text-end" style={{width: 140}}>Precio</th>
                                    <th className = "text-end" style={{width: 160}}>Subtotal</th>
                                    <th style={{width: 120}}></th>
                                </tr>
                            </thread>

                            <tbody>
                                {items.map((item) => {
                                    const subtotal = Number(item.precio) * Number(item.qty);

                                    return(
                                        <tr key = {item.id}>
                                            <td>
                                                <div className = "d-flex gap-3 align-items-center">
                                                    <img src = {item.imagen || ""}
                                                        alt = {item.nombre}
                                                        className = "rounded"
                                                        style = {{ width: 96, height: 64, objectFit: "cover"}}
                                                    />
                                                
                                                    <div>
                                                        <div className = "fw-semibold">{item.nombre}</div>
                                                        <div className = "text-muted small">{item.categoria}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className = "text-center"> 
                                                <div className = "d.inline-flex align-items-center gap-2">
                                                    <button className = "btn btn-sm btn-outline-secondary" onClick = {() => setQty(item.id, item.qty -1)}>
                                                        -
                                                    </button>

                                                    <input 
                                                        className = "form-control form-control-sm text-center"
                                                        style = {{width: 64}}
                                                        type = "number"
                                                        min = "1"
                                                        value = {item.qty}
                                                        onChange = {(e) => setQty(item.id, e.target.value)}
                                                    />

                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => setQty(item.id, item.qty + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>

                                            <td className = "text-end">
                                                {Number(item.precio).toLocaleString("es-ES")} €
                                            </td>

                                            <td className = "text-end fw-semibold">
                                                {subtotal.toLocaleString("es-ES")} €
                                            </td>

                                            <td className="text-end">
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => confirmRemove(item)}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className = "d-flex justify-content-end mt-3">
                        <div className = "fs-5">
                            Total: {" "}
                            <span className = "fw-bold">
                                {total.toLocaleString("es-ES")} €
                            </span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}