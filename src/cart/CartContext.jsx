import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const KEY = "cartItems";

function loadCart(){
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function CartProvider({children}){
    const [items, setItems] = useState(loadCart());

    useEffect (() =>{
        localStorage.setItem(KEY, JSON.stringify(items));
    }, [items]);

    function addToCart(product, qty = 1){
        setItems((prev) => {
            const found = prev.find((i) => i.id === product.id);
            if(found){
                return prev.map((i) =>
                    i.id === product.id ? { ...i, qty: i.qty + qty} : i
                );
            }

            return [
                ...prev,
                {
                    id: product.id,
                    nombre: product.nombre,
                    precio: Number(product.precio),
                    imagen: product.imagen,
                    categoria: product.categoria,
                    qty
                }
            ];
        });
    }

    function removeFromCart(id){
        setItems((prev) => prev.filter((i) => i.id !== id));
    }

    function setQty(id, qty){
        const q = Number(qty);
        if (!Number.isFinite(q)) return;

        setItems((prev) =>
            prev
                .map((i) => (i.id === id ? { ...i, qty: q} : i))
                .filter((i) => i.qty >0)
        );
    }

    function clearCart(){
        setItems([]);
    }

    const total = useMemo(
        () => items.reduce((sum, i) => sum + Number(i.precio) * Number(i.qty), 0), [items]
    );

    const value = { items, addToCart, removeFromCart, setQty, clearCart, total };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;  
}

export function useCart(){
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>")
    return ctx;
}