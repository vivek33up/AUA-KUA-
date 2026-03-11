// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ApplicationIndex from "./pages/application/ApplicationIndex";
import AdminDashboard from "./pages/AdminDashboard";
import RecoverAdminId from "./pages/RecoverAdminId";
import Form from "./pages/Form";
import AdminApplications from "./pages/AdminApplications";
import AdminViewApplication from "./pages/AdminViewApplication";
import ResetPasswordRequest from "./pages/ResetPasswordRequest";
import ResetAdminPassword from "./pages/ResetAdminPassword";

export default function App() {
  return (
    <Routes>
      {/* 1. Initial Redirect */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* 2. Authentication Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* 3. Password & ID Recovery Flow */}
      <Route path="/recover-admin-id" element={<RecoverAdminId />} />
      <Route path="/forgot-password" element={<ResetPasswordRequest />} />
      <Route path="/reset-admin-password" element={<ResetAdminPassword />} />
    
      {/* 4. User / Application Routes */}
      <Route path="/application" element={<ApplicationIndex />} />
      <Route path="/application/form" element={<Form />} />

      {/* 5. Admin Dashboard Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/applications" element={<AdminApplications />} />
      <Route path="/admin/applications/:id" element={<AdminViewApplication />} />

      {/* 6. Catch-all: Redirect unknown paths to Login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}