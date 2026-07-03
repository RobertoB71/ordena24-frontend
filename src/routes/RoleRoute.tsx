import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canAccessRoute } from "../security/permissions";

export default function RoleRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Cargando permisos...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const allowed = canAccessRoute(location.pathname, user.rol_id);

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}