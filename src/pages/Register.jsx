import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../auth/auth.js";

function calcAge(yyyyMmDd) {
    const dob = new Date(yyyyMmDd);
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
    const [email, setEmail] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

    const age = useMemo(() => calcAge(fechaNacimiento), [fechaNacimiento]);

    function validate() {
        const e = {};

        if (!nombre.trim()) e.nombre = "El nombre es obligatorio.";
        if (!apellidos.trim()) e.apellidos = "Los apellidos son obligatorios.";

        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
        if (!email.trim()) e.email = "El email es obligatorio.";
        else if (!emailOk) e.email = "Email no válido.";

        if (!fechaNacimiento) e.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
        else if (age === null) e.fechaNacimiento = "Fecha no válida.";
        else if (age < 18) e.fechaNacimiento = "Debes ser mayor de edad (18+).";

        if (!password) e.password = "La contraseña es obligatoria.";
        else if (password.length < 6) e.password = "Mínimo 6 caracteres.";

        if (!confirm) e.confirm = "Repite la contraseña.";
        else if (confirm !== password) e.confirm = "Las contraseñas no coinciden.";

        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function handleSubmit(ev) {
        ev.preventDefault();
        setServerError("");

        if (!validate()) return;

        try {
            registerUser({
                nombre: nombre.trim(),
                apellidos: apellidos.trim(),
                email: email.trim(),
                fechaNacimiento,
                password
            });

            navigate("/", { replace: true });
        }catch (err) {
            setServerError(err.message || "Error al registrar.");
        }
    }

    return (
        <div className="container-fluid py-4">
            <div className="row g-4 align-items-stretch">
                <div className="col-12">
                    <div className="p-4 border rounded-3 h-100">
                        <h1 className="mb-3">Crear cuenta</h1>
                        <p className="text-muted">
                            Regístrate para poder comprar. Se iniciará sesión automáticamente al completar el registro.
                        </p>

                        {serverError && <div className="alert alert-danger">{serverError}</div>}

                        <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
                            <div className="row g-3">
                                <div className="col-12 col-md-6">
                                    <label className="form-label">Nombre</label>
                                    <input
                                        className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        placeholder="Nombre"
                                    />
                                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label">Apellidos</label>
                                    <input
                                        className={`form-control ${errors.apellidos ? "is-invalid" : ""}`}
                                        value={apellidos}
                                        onChange={(e) => setApellidos(e.target.value)}
                                        laceholder="Apellidos"
                                    />
                                    {errors.apellidos && <div className="invalid-feedback">{errors.apellidos}</div>}
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Email</label>
                                    <input
                                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="email@ejemplo.com"
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label">Fecha de nacimiento</label>
                                    <input
                                        type="date"
                                        className={`form-control ${errors.fechaNacimiento ? "is-invalid" : ""}`}
                                        value={fechaNacimiento}
                                        onChange={(e) => setFechaNacimiento(e.target.value)}
                                    />
                                    {errors.fechaNacimiento && (
                                    <div className="invalid-feedback">{errors.fechaNacimiento}</div>)}
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label">Repetir contraseña</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.confirm ? "is-invalid" : ""}`}
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        placeholder="Repite la contraseña"
                                    />
                                    {errors.confirm && <div className="invalid-feedback">{errors.confirm}</div>}
                                </div>
                            </div>

                            <button className="btn btn-primary mt-4" type="submit">
                                Registrarme
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
