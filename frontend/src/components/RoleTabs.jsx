// src/components/RoleTabs.jsx
import { RoleTab } from "../layouts/LoginLayout";

export default function RoleTabs({ role, onChange }) {
  return (
    <div className="flex gap-3 mb-6">
      <RoleTab active={role === "user"} onClick={() => onChange("user")}>
        User
      </RoleTab>
      <RoleTab active={role === "admin"} onClick={() => onChange("admin")}>
        Admin
      </RoleTab>
    </div>
  );
}
