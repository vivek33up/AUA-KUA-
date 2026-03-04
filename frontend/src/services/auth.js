// src/services/auth.js
const API = "http://localhost:3000";

export function getSession() {
  try {
    const data = sessionStorage.getItem("session");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setSession(session) {
  sessionStorage.setItem("session", JSON.stringify(session));
}

export function logout() {
  sessionStorage.removeItem("session");
}

export function isAuthenticated(requiredRole) {
  const s = getSession();
  if (!s) return false;
  if (requiredRole && s.role !== requiredRole) return false;
  return true;
}
