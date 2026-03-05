// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import AuditChecklist from "./pages/AuditChecklist";
import AuditorDashboard from "./pages/AuditorDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Form (kept in original location)
import Form from "./pages/Form";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* User (AUA/KUA Entity) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="user">
            <Layout><UserDashboard /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/application/form"
        element={
          <ProtectedRoute role="user">
            <Layout><Form /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/audit/checklist/:auditId"
        element={
          <ProtectedRoute>
            <Layout><AuditChecklist /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/audit/checklist"
        element={
          <ProtectedRoute role="user">
            <Layout><UserDashboard /></Layout>
          </ProtectedRoute>
        }
      />

      {/* Auditor */}
      <Route
        path="/auditor"
        element={
          <ProtectedRoute role="auditor">
            <Layout><AuditorDashboard /></Layout>
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <Layout><AdminDashboard /></Layout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

