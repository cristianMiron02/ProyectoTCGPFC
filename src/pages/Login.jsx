import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginWithEmail } from "../auth/authFirebase.js";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Introduce email y contraseña.");
      return;
    }

    try {
      await loginWithEmail(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Error al iniciar sesión.");
    }
  }

  return (
    <div className="container-fluid py-4">
      <div className="p-4 border rounded-3">
        <h1 className="mb-3">Iniciar sesión</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-control" value={password} onChange={(e)=>setPassword(e.target.value)} />
          </div>

          <button className="btn btn-primary" type="submit">Entrar</button>
          <div className="mt-3">
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
