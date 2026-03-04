// src/components/Layout.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getSession, logout } from "../services/auth";

const NAV_ITEMS = {
    user: [
        { path: "/dashboard", label: "Dashboard", icon: "📊" },
        { path: "/application/form", label: "Application Form", icon: "📝" },
        { path: "/audit/checklist", label: "Compliance Checklist", icon: "✅" },
    ],
    auditor: [
        { path: "/auditor", label: "Dashboard", icon: "📊" },
    ],
    admin: [
        { path: "/admin", label: "Dashboard", icon: "📊" },
    ],
};

export default function Layout({ children }) {
    const nav = useNavigate();
    const loc = useLocation();
    const session = getSession();

    const items = NAV_ITEMS[session?.role] || [];

    const handleLogout = () => {
        logout();
        nav("/login", { replace: true });
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 flex flex-col"
                style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)" }}>
                {/* Logo */}
                <div className="px-5 py-5 border-b border-white/10">
                    <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                            🛡️
                        </span>
                        AUA/KUA Portal
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Compliance Management</p>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {items.map((item) => {
                        const isActive = loc.pathname === item.path || loc.pathname.startsWith(item.path + "/");
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 no-underline ${isActive
                                        ? "bg-white/15 text-white shadow-sm"
                                        : "text-slate-300 hover:bg-white/8 hover:text-white"
                                    }`}
                            >
                                <span className="text-base">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info */}
                <div className="px-4 py-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                            {session?.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{session?.name || "User"}</p>
                            <p className="text-xs text-slate-400 capitalize">{session?.role || "user"}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors border border-white/10 cursor-pointer"
                    >
                        ← Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-6 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
