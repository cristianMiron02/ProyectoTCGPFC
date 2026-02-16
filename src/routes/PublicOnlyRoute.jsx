import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth.js";

export default function PublicOnlyRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : <Outlet />;
}
