import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerWithEmail } from "../auth/authFirebase.js";

function calcAge(dateStr) {
  const dob = new Date(dateStr);
  if (Number.isNaN(dob.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

  return age;
}

export default function Register() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const age = useMemo(() => calcAge(fechaNacimiento), [fechaNacimiento]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (
      !nombre.trim() ||
      !apellidos.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !fechaNacimiento
    ) {
      setError("Completa todos los campos.");
      return;
    }

    if (age === null || age < 18) {
      setError("Debes ser mayor de edad (18+).");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await registerWithEmail(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Error al registrar.");
    }
  }

  return (
    <div className="container-fluid py-4">
      <div className="p-4 border rounded-3">
        <h1 className="mb-3">Crear cuenta</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Nombre</label>
              <input
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Apellidos</label>
              <input
                className="form-control"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
              />
            </div>

            <div className="col-12">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Fecha de nacimiento</label>
              <input
                type="date"
                className="form-control"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="form-text">Mínimo 6 caracteres.</div>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Confirmar contraseña</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="form-text">
                Debe coincidir con la contraseña anterior.
              </div>
            </div>
          </div>

          <button className="btn btn-primary mt-4" type="submit">
            Registrarme
          </button>
        </form>
      </div>
    </div>
  );
}