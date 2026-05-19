import { Link } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase/firebase.js";

export default function VerifyEmail() {
    async function resendEmail() {
        if (!auth.currentUser) {
            alert("No hay usuario conectado.");
            return;
        }

        try {
            await sendEmailVerification(auth.currentUser);
            alert("Correo de verificación reenviado.");
        } catch (err) {
            console.error("Error reenviando correo:", err);
            alert("No se pudo reenviar el correo.");
        }
    }

    return (
        <div className="container-fluid py-4">
            <div className="p-4 border rounded-3">
                <h1>Verifica tu correo</h1>

                <p className="text-muted">
                    Te hemos enviado un email de confirmación. Revisa tu bandeja de entrada y pulsa el enlace para verificar tu cuenta.
                </p>

                <p>
                    Después de verificarlo, vuelve a iniciar sesión o recarga la página.
                </p>

                <button className="btn btn-primary me-2" onClick={resendEmail}>
                    Reenviar correo
                </button>

                <Link to="/login" className="btn btn-outline-secondary">
                    Ir al login
                </Link>
            </div>
        </div>
    );
}