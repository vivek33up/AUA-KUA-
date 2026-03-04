// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { getSession } from "../services/auth";

export default function ProtectedRoute({ role, children }) {
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;
  if (role && session.role !== role) return <Navigate to="/login" replace />;
  return children;
}
