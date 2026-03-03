// src/services/auth.js

const LS_KEYS = {
  USERS: "auth:users",
  ADMINS: "auth:admins",
  SESSION: "auth:session",
};

function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getSession() {
  return read(LS_KEYS.SESSION, null);
}
function setSession(s) {
  write(LS_KEYS.SESSION, s);
}
export function logout() {
  localStorage.removeItem(LS_KEYS.SESSION);
}

function getUsers() {
  return read(LS_KEYS.USERS, []);
}
function setUsers(v) {
  write(LS_KEYS.USERS, v);
}
function getAdmins() {
  return read(LS_KEYS.ADMINS, []);
}
function setAdmins(v) {
  write(LS_KEYS.ADMINS, v);
}

// ---------- USER ----------
export function signupUser({ name, email, password }) {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
    throw new Error("USER_EXISTS");
  const user = { name, email, password };
  users.push(user);
  setUsers(users);
  // no auto-login: force explicit login next
  return user;
}

export function loginUser({ email, password }) {
  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    const e = new Error("USER_NOT_FOUND");
    e.meta = { email };
    throw e;
  }
  if (user.password !== password) throw new Error("INVALID_PASSWORD");
  setSession({ role: "user", id: user.email });
  return user;
}

// ---------- ADMIN ----------
function generateAdminId(existing = []) {
  const pad = (n) => String(n).padStart(2, "0");
  const d = new Date();
  const yyyymmdd = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  let id;
  do {
    const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
    id = `ADM-${yyyymmdd}-${rand}`;
  } while (existing.some((a) => a.adminId === id));
  return id;
}

export function signupAdmin({ name, email, password }) {
  const admins = getAdmins();

  // 1) Prevent duplicate email (force login / recovery instead of new account)
  if (admins.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("ADMIN_EMAIL_TAKEN");
  }

  // 2) Generate unique Admin ID
  const adminId = generateAdminId(admins);

  const admin = { adminId, name, email, password };
  admins.push(admin);
  setAdmins(admins);
  // no auto-login
  return admin; // { adminId, ... }
}

export function loginAdmin({ adminId, password }) {
  const admins = getAdmins();
  const admin = admins.find(
    (a) => a.adminId.toLowerCase() === adminId.toLowerCase(),
  );
  if (!admin) throw new Error("ADMIN_NOT_FOUND");
  if (admin.password !== password) throw new Error("INVALID_PASSWORD");
  setSession({ role: "admin", id: admin.adminId });
  return admin;
}

// Lookup helpers for recovery flows
export function findAdminIdByEmail(email) {
  const admins = getAdmins();
  const a = admins.find((x) => x.email.toLowerCase() === email.toLowerCase());
  return a?.adminId || null;
}

export const isUserAuthenticated = () => getSession()?.role === "user";
export const isAdminAuthenticated = () => getSession()?.role === "admin";
