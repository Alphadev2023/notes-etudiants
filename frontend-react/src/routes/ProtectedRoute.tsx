import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../application/auth/useAuth";

export function ProtectedRoute() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}
