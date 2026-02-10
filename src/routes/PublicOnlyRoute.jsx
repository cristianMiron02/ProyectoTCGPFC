import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../auth/auth.js";

export default function PublicOnlyRoute(){
    return isLoggedIn() ? <Navigate to = "/" replace/> : <Outlet />;
}