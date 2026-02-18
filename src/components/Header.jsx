import { Link, NavLink, useNavigate, createSearchParams } from "react-router-dom";
import { useState } from "react";
import { logoutFirebase } from "../auth/authFirebase.js";
import { useAuth } from "../auth/useAuth.js";

export default function Header() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { user, loading } = useAuth();

  function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();

    navigate({
      pathname: "/catalog",
      search: q ? `?${createSearchParams({ q })}` : ""
    });

    setQuery("");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold" to="/">
          TiendaReact
        </Link>

        <div className="d-flex gap-2 align-items-center ms-auto">
          <form className="d-flex" onSubmit={handleSearch}>
            <input
              className="form-control form-control-sm"
              placeholder="Buscar productos"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-sm btn-primary ms-2" type="submit">
              Buscar
            </button>
          </form>

          <div className="navbar-nav ms-3">
            <NavLink className="nav-link" to="/">
              Inicio
            </NavLink>
            <NavLink className="nav-link" to="/catalog">
              Productos
            </NavLink>
            <NavLink className="nav-link" to="/cart">
              Carrito
            </NavLink>
          </div>

          {!loading && user ? (
            <>
              <span className="text-muted small ms-2 d-none d-lg-inline">
                {user.email}
              </span>

              <button
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={async () => {
                  await logoutFirebase();
                  navigate("/");
                }}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            !loading && (
              <button
                className="btn btn-sm btn-outline-success ms-2"
                onClick={() => navigate("/login")}
              >
                Iniciar sesión
              </button>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
