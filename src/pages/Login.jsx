import { useNavigate } from "react-router-dom";
import { loginFake } from "../auth/auth";

export default function Login(){
    const navigate = useNavigate();

    return (
        <div className = "container py-4" style ={{maxWidth: 420}}>
            <h1 className = "mb-3">Iniciar Sesión</h1>
            <p className = "text-muted">
                Pulsa el botón para inciar sesión
            </p>

            <button className = "btn btn-primary w-100" onClick = {() => {
                loginFake();
                navigate("/catalog");
                }}
            >
                Entrar
            </button>
        </div>
    )
}