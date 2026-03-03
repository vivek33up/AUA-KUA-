// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

// Pages under src/pages/application
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ApplicationIndex from "./pages/application/ApplicationIndex";
import AdminDashboard from "./pages/AdminDashboard";
import RecoverAdminId from "./pages/RecoverAdminId";
import ResetAdminPassword from "./pages/ResetAdminPassword";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// ⚠️ Form.jsx currently lives OUTSIDE src at: frontend/pages/Form.jsx
// So from src/App.jsx the correct relative import is:
import Form from "../pages/Form";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/recover-admin-id" element={<RecoverAdminId />} />
      <Route path="/reset-admin-password" element={<ResetAdminPassword />} />

      {/* USER: Application area index (auto-redirects to /application/form on mount) */}
      <Route
        path="/application"
        element={
          <ProtectedRoute role="user">
            <ApplicationIndex />
          </ProtectedRoute>
        }
      />

      {/* USER: Actual form route */}
      <Route
        path="/application/form"
        element={
          <ProtectedRoute role="user">
            <Form />
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

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
