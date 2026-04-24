import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Clock,
  Sword,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/contributions", icon: Clock, label: "Pending Contributions" },
  { to: "/fighters", icon: Sword, label: "Freedom Fighters" },
  { to: "/users", icon: Users, label: "User Management" },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`layout ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Shield size={24} />
            {sidebarOpen && <span>Admin Panel</span>}
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {sidebarOpen && (
          <div className="sidebar-brand">
            <p className="brand-name">Glimpses of Bharat</p>
          </div>
        )}

        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} />
              {sidebarOpen && <span>{label}</span>}
              {sidebarOpen && <ChevronRight size={14} className="nav-arrow" />}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {sidebarOpen && (
            <div className="user-info">
              <div className="user-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="user-details">
                <span className="user-name">{user?.name || "Admin"}</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
          )}
          <button
            className="logout-btn"
            onClick={handleLogout}
            aria-label="Logout"
            title="Logout"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <div className="topbar">
          <div className="topbar-breadcrumb">
            <span>Admin</span>
          </div>
          <div className="topbar-user">
            <div className="user-chip">
              <div className="chip-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <span>{user?.name || "Admin"}</span>
            </div>
          </div>
        </div>
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
