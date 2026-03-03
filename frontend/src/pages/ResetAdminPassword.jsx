// src/pages/ResetAdminPassword.jsx
import { useState } from "react";

export default function ResetAdminPassword() {
  const [adminId, setAdminId] = useState("");
  const [newPass, setNewPass] = useState("");
  const [msg, setMsg] = useState("");

  const submit = (e) => {
    e.preventDefault();
    try {
      const admins = JSON.parse(localStorage.getItem("auth:admins") || "[]");
      const idx = admins.findIndex(
        (a) => a.adminId.toLowerCase() === adminId.trim().toLowerCase(),
      );
      if (idx === -1) return setMsg("Admin ID not found.");
      admins[idx].password = newPass.trim();
      localStorage.setItem("auth:admins", JSON.stringify(admins));
      setMsg("Password updated. You can login now.");
    } catch {
      setMsg("Something went wrong.");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Reset Admin Password</h2>
      <form
        onSubmit={submit}
        style={{ display: "grid", gap: 8, maxWidth: 360 }}
      >
        <label>Admin ID</label>
        <input
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
          placeholder="ADM-..."
        />
        <label>New Password</label>
        <input
          type="password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
