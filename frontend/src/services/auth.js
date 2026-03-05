// src/services/auth.js
// JWT-based auth service — stores token in sessionStorage

const TOKEN_KEY = "auth:token";

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
 * Returns { userId, role, iat, exp } or null.
 */
export function getSession() {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Check if token has expired
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      removeToken();
      return null;
    }

    return payload;
  } catch {
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
