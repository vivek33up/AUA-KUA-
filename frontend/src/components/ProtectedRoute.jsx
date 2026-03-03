// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { isUserAuthenticated, isAdminAuthenticated } from "../services/auth";

export default function ProtectedRoute({ role, children }) {
  if (role === "user" && !isUserAuthenticated())
    return <Navigate to="/login" replace />;
  if (role === "admin" && !isAdminAuthenticated())
    return <Navigate to="/login" replace />;
  return children;
}
