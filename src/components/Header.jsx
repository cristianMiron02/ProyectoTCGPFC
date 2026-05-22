import { Link, NavLink, useNavigate, createSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { logoutFirebase } from "../auth/authFirebase.js";
import { useAuth } from "../auth/useAuth.js";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";

export default function Header() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const { user, loading } = useAuth();

  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        setIsAdmin(userSnap.exists() && userSnap.data().role === "admin");
      } catch (err) {
        console.error("Error comprobando admin:", err);
        setIsAdmin(false);
      }
    }

    checkAdmin();
  }, [user]);

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
    <nav className="navbar navbar-expand-lg navbar-dark bg-black border-bottom border-secondary">
      <div className="container-fluid px-4">
        <Link
          className="navbar-brand fw-bold d-flex align-items-center gap-2"
          to="/"
        >
          <img
            src="/LogoTheGodCards.png"
            alt="Logo Tienda TCG"
            style={{
              width: 50,
              height: 50,
              objectFit: "contain"
            }}
          />

          <span>TCG(The God Cards)</span>
        </Link>

        <div className="d-flex gap-2 align-items-center ms-auto">
          <form className="d-flex" onSubmit={handleSearch}>
            <input
              className="form-control form-control-sm"
              placeholder="Buscar productos"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <button className="btn" style={{
              backgroundColor: "#d4af37",
              borderColor: "#d4af37",
              color: "#292929"
            }}>
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
            <div className="dropdown ms-2">
              <button
                className="btn btn-sm btn-outline-light dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Mi perfil
              </button>

              

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/profile")}
                  >
                    Ver perfil
                  </button>
                </li>

                <li><hr className="dropdown-divider" /></li>

                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/orders")}
                  >
                    Mis compras
                  </button>
                </li>

                <li><hr className="dropdown-divider" /></li>

                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/favorites")}
                  >
                    Favoritos
                  </button>
                </li>

                {isAdmin && (
                  <>
                    <li><hr className="dropdown-divider" /></li>

                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => navigate("/admin")}
                      >
                        Panel admin
                      </button>
                    </li>
                  </>
                )}

                <li><hr className="dropdown-divider" /></li>


                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={async () => {
                      await logoutFirebase();
                      setIsAdmin(false);
                      navigate("/");
                    }}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
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