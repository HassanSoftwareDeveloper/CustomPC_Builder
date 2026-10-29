import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ allowedRole }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
