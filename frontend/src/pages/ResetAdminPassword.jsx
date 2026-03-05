// src/pages/ResetAdminPassword.jsx
import { useState } from "react";
import axios from "axios";

export default function ResetAdminPassword() {
  const [adminId, setAdminId] = useState("");
  const [newPass, setNewPass] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!adminId.trim() || !newPass.trim()) {
      setMsg("Both fields are required.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/test/reset-password", {
        adminId: adminId.trim(),
        newPassword: newPass.trim(),
      });
      setMsg(res.data.message || "Password updated. You can login now.");
    } catch (err) {
      const errorMsg = err?.response?.data?.error;
      setMsg(errorMsg || "Something went wrong.");
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
