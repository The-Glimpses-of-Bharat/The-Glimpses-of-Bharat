import React from "react";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./dashboards/AdminDashboard";
import ContributorDashboard from "./dashboards/ContributorDashboard";
import PremiumDashboard from "./dashboards/PremiumDashboard";
import UserDashboard from "./dashboards/UserDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "contributor":
      return <ContributorDashboard />;
    case "premium":
      return <PremiumDashboard />;
    case "user":
    default:
      return <UserDashboard />;
  }
}
