import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { LoadingScreen } from "../components/LoadingScreen";

export function ProtectedRoute() {
  const { session, loading } = useAuth();

  if (loading) return <LoadingScreen label="Loading your account…" />;
  if (!session) return <Navigate to="/login" replace />;

  return <Outlet />;
}
