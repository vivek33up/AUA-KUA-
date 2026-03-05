// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ApplicationIndex from "./pages/application/ApplicationIndex";
import AdminDashboard from "./pages/AdminDashboard";
import RecoverAdminId from "./pages/RecoverAdminId";
import ResetAdminPassword from "./pages/ResetAdminPassword";
import Form from "./pages/Form";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/recover-admin-id" element={<RecoverAdminId />} />
      <Route path="/reset-admin-password" element={<ResetAdminPassword />} />

      <Route path="/application" element={<ApplicationIndex />} />
      <Route path="/application/form" element={<Form />} />

      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
