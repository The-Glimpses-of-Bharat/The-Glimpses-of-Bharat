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
  UserCircle,
  PenLine,
  Brain,
  Trophy,
  MapPin,
  BarChart3,
  BookOpen,
  Home
} from "lucide-react";
import ChatBot from "./ChatBot";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getNavItems = (role) => {
    const items = [
      { to: "/", icon: Home, label: "Home Page" },
      { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/research", icon: BookOpen, label: "Research Portal" },
      { to: "/quiz", icon: Brain, label: "Quiz" },
      { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
      { to: "/map", icon: MapPin, label: "Heritage Map" },
      { to: "/analytics", icon: BarChart3, label: "Analytics" },
      { to: "/profile", icon: UserCircle, label: "My Profile" }
    ];
    items.push({ to: "/contribute", icon: PenLine, label: "Suggestion Portal" });
    if (role === "admin" || role === "contributor") {
      items.push({ to: "/contributions", icon: Clock, label: "Contributions" });
    }
    if (role === "admin") {
      items.push({ to: "/fighters", icon: Sword, label: "Freedom Fighters" });
      items.push({ to: "/users", icon: Users, label: "User Management" });
    }
    return items;
  };

  const currentNavItems = getNavItems(user?.role);

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
            {sidebarOpen && <span>Glimpses of Bharat</span>}
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
          {currentNavItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
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
                <span className="user-name">{user?.name || "User"}</span>
                <span className="user-role" style={{ textTransform: "capitalize" }}>{user?.role || "user"}</span>
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
            <span style={{ textTransform: "capitalize" }}>{user?.role || "Dashboard"}</span>
          </div>
          <div className="topbar-user">
            <div className="user-chip">
              <div className="chip-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span>{user?.name || "User"}</span>
            </div>
          </div>
        </div>
        <div className="page-content">{children}</div>
      </main>
      <ChatBot />
    </div>
  );
}
