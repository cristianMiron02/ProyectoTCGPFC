import { Link, NavLink } from "react-router-dom";

export default function Header(){
    return (
        <nav className = "navbar navbar-expand-lg navbar-light bg-light border-botton">
            <div className = "container">
                <Link className = "navbar-brand fw-bold" to = "/">
                    TiendaReact
                </Link>

                <button className = "navbar-toggle" type = "button" data-bs-toggle = "collapse" data-bs-target = "#nav">
                    <span className = "navbar-toggle-icon"></span>
                </button>

                <div className = "collapse navbar-collapse" id = "nav">
                    <div className = "navbar-nav ms-auto gap-2">
                        <NavLink className="nav-link" to="/">
                            Inicio
                        </NavLink>
                        <NavLink className="nav-link" to="/">
                            Catálogo
                        </NavLink>
                        <NavLink className="nav-link" to="/">
                            Carrito
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
}