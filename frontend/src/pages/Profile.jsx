import React from "react";
import { useAuth } from "../context/AuthContext";
import { Shield, User, Mail, Award, Key } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin": return <span className="badge badge-admin">Administrator</span>;
      case "contributor": return <span className="badge badge-pending">Contributor</span>;
      case "premium": return <span className="badge badge-approved">Premium Member</span>;
      default: return <span className="badge badge-yellow">Citizen</span>;
    }
  };

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Your personal identity in Glimpses of Bharat</p>
        </div>
      </div>
      
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header-banner"></div>
          
          <div className="profile-avatar-container">
            <div className="profile-avatar-large">
              {user?.name?.charAt(0).toUpperCase() || "B"}
            </div>
          </div>
          
          <div className="profile-info">
            <h2 className="profile-name">{user?.name || "Bharat Vasi"}</h2>
            <div className="profile-role-badge">
              {getRoleBadge(user?.role)}
            </div>
            
            <div className="profile-details-grid">
              <div className="profile-detail-item">
                <Mail className="detail-icon" size={18} />
                <div className="detail-text">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{user?.email}</span>
                </div>
              </div>
              
              <div className="profile-detail-item">
                <Shield className="detail-icon" size={18} />
                <div className="detail-text">
                  <span className="detail-label">Account Security</span>
                  <span className="detail-value">Secured (JWT)</span>
                </div>
              </div>
              
              <div className="profile-detail-item">
                <Award className="detail-icon" size={18} />
                <div className="detail-text">
                  <span className="detail-label">Premium Status</span>
                  <span className="detail-value">{user?.isPremium ? "Active" : "Inactive"}</span>
                </div>
              </div>
              
              <div className="profile-detail-item">
                <Key className="detail-icon" size={18} />
                <div className="detail-text">
                  <span className="detail-label">User ID</span>
                  <span className="detail-value text-mono">{user?._id?.substring(0, 8)}...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
