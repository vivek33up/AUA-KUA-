import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ApplicationIndex from "./pages/application/ApplicationIndex";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import RecoverAdminId from "./pages/RecoverAdminId";
import ResetAdminPassword from "./pages/ResetAdminPassword";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/recover-admin-id" element={<RecoverAdminId />} />
      <Route path="/reset-admin-password" element={<ResetAdminPassword />} />

      {/* USER: Application area (teammate will add nested routes under /application/*) */}
      <Route
        path="/application/*"
        element={
          <ProtectedRoute role="user">
            <ApplicationIndex />
          </ProtectedRoute>
        }
      />

      {/* ADMIN: Dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
