import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../auth/auth.js";

export default function ProtectedRoute(){
    return isLoggedIn() ? <Outlet /> : <Navigate to = "/login" replace />;
}