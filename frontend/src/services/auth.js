// src/services/auth.js
// JWT-based auth service — stores token in sessionStorage
import axios from "axios";

const TOKEN_KEY = "auth:token";
// Base URL for your backend auth endpoints
const API_URL = "http://localhost:3000/test";

/** Store the JWT token */
export function setToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

/** Get the raw JWT token */
export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

/** Remove token (logout) */
export function removeToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

/**
 * Decode the JWT payload (without cryptographic verification).
 * Returns { userId, role, iat, exp, token } or null.
 */
export function getSession() {
  const token = getToken();
  if (!token) return null;

  try {
    // Decode the middle part (payload) of the JWT string
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Check if token has expired
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      removeToken();
      return null;
    }

    // Return the payload spread AND the raw token string
    return { 
      ...payload, 
      token 
    };
  } catch (err) {
    removeToken();
    return null;
  }
}

/** Clear session and remove token */
export function logout() {
  removeToken();
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("role");
}

/** Check if a user with role "user" is authenticated */
export const isUserAuthenticated = () => getSession()?.role === "user";

/** Check if a user with role "admin" is authenticated */
export const isAdminAuthenticated = () => getSession()?.role === "admin";

/**
 * NEW: API call to request a password reset
 * This targets your backend route: POST http://localhost:3000/test/request-reset
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/request-reset`, { email });
    return response.data;
  } catch (error) {
    // Re-throw the error so your React component can catch it and show an alert
    throw error.response?.data || { error: "Network error occurred" };
  }
};