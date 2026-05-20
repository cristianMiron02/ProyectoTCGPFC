import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../firebase/firebase.js";
import { useAuth } from "../auth/useAuth.js";
import { logoutFirebase } from "../auth/authFirebase.js";

export default function Profile() {
    const navigate = useNavigate();

    const { user, loading: authLoading } = useAuth();

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
        try {
            if (!user) return;

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
            setUserData(userSnap.data());
            }
        } catch (err) {
            console.error("Error cargando perfil:", err);
        } finally {
            setLoading(false);
        }
        }

        if (!authLoading) {
        loadProfile();
        }
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
        <div className="container-fluid py-4">
            Cargando perfil...
        </div>
        );
    }

    if (!user) {
        return (
        <div className="container-fluid py-4">
            <div className="alert alert-warning">
            Debes iniciar sesión para ver tu perfil.
            </div>

            <Link to="/login" className="btn btn-gold">
            Iniciar sesión
            </Link>
        </div>
        );
    }

    return (
        <div className="container-fluid py-4">
        <div
            className="card bg-dark text-white border-secondary shadow-lg"
            style={{
            maxWidth: 800,
            margin: "0 auto",
            borderRadius: 20
            }}
        >
            <div className="card-body p-4">

            <div className="d-flex align-items-center gap-4 mb-4">

                <div
                style={{
                    width: 90,
                    height: 90,
                    borderRadius: "50%",
                    backgroundColor: "#d4af37",
                    color: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2.3rem",
                    fontWeight: "bold"
                }}
                >
                {userData?.username?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div>
                <h2 className="mb-1">
                    {userData?.username || "Usuario"}
                </h2>

                <div className="text-muted">
                    {user.email}
                </div>
                </div>

            </div>

            <hr className="border-secondary" />

            <div className="row g-4 mt-2">

                <div className="col-12 col-md-6">
                <h6 className="text-warning">Nombre completo</h6>

                <div>
                    {userData?.nombre} {userData?.apellidos}
                </div>
                </div>

                <div className="col-12 col-md-6">
                <h6 className="text-warning">Tipo de cuenta</h6>

                <div>
                    {userData?.tipoCuenta === "buyer" && "🛒 Comprador"}
                    {userData?.tipoCuenta === "seller" && "💰 Vendedor"}
                    {userData?.tipoCuenta === "both" && "⚡ Comprador/Vendedor"}
                </div>
                </div>

                <div className="col-12 col-md-6">
                <h6 className="text-warning">Nacionalidad</h6>

                <div>
                    {userData?.nacionalidad || "No indicada"}
                </div>
                </div>

                <div className="col-12 col-md-6">
                <h6 className="text-warning">Correo verificado</h6>

                <div>
                    {user.emailVerified ? (
                    <span className="text-success">
                        ✅ Verificado
                    </span>
                    ) : (
                    <span className="text-danger">
                        ❌ No verificado
                    </span>
                    )}
                </div>
                </div>
            </div>

            <hr className="border-secondary my-4" />

            </div>
        </div>
        </div>
    );
}