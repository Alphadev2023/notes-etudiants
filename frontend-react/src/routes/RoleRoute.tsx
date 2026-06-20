import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../application/auth/useAuth";
import type { Role } from "../domain/user";

interface RoleRouteProps {
  allowedRoles: Role[];
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const currentUser = useAuth((state) => state.currentUser);

  if (!currentUser) {
    return <Navigate to="/auth/login" replace />;
  }

  const hasAccess = currentUser.roles.some((role) =>
    allowedRoles.includes(role),
  );

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
