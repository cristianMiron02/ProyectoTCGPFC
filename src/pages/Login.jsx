    import { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import { loginFake } from "../auth/auth.js";

    export default function Login() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!usuario.trim() || !password.trim()) {
        setError("Introduce usuario y contraseña.");
        return;
        }

        loginFake();
        navigate("/", { replace: true });
    }

    return (
        <div className="container-fluid py-4">
        <div className="row g-4 align-items-stretch">
            <div className="col-12">
            <div className="p-4 border rounded-3 h-100">
                <h1 className="mb-3">Iniciar sesión</h1>
                <p className="text-muted">
                Accede para añadir productos al carrito.
                </p>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
                <div className="mb-3">
                    <label className="form-label">Usuario</label>
                    <input
                    className="form-control"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    placeholder="Usuario"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    />
                </div>

                <button className="btn btn-primary" type="submit">
                    Entrar
                </button>
                </form>
            </div>
            </div>
        </div>
        </div>
    );
    }
