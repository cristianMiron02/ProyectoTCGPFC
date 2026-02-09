import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

export default function Header(){
    const[q, setQ] = useState("");
    const navigate = useNavigate();

    function onSubmit(e){
        e.preventDefault();
        const query = q.trim();

        navigate({
            pathname: "/catalog",
            search: query ? `?${createSearchParams({ q: query })}` : ""
        });
    }
    return (
        <nav className = "navbar navbar-expand-lg navbar-light bg-light border-botton">
            <div className = "container">
                <Link className = "navbar-brand fw-bold" to = "/">
                    TiendaReact
                </Link>

                <div className = "d-flex gap-2 align-items-center ms-auto">
                    <form className = "d-flex" onSubmit = {onSubmit}>
                        <input className="form-control form-control-sm" placeholder="Buscar productos" value={q} onChange={(e) => setQ(e.target.value)}/>
                        <button className = "btn btn-sm btn-primary ms-2" type = "submit"> Buscar </button>                    
                    </form>

                    <div className="navbar-nav ms-3">
                        <NavLink className="nav-link" to="/">Inicio</NavLink>
                        <NavLink className="nav-link" to="/catalog">Productos</NavLink>
                        <NavLink className="nav-link" to="/cart">Carrito</NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
}