import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Eye, EyeOff, Loader, UserPlus } from "lucide-react";

export default function Signup() {
  const { signup, login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(formData);
      // After successful signup, immediately log them in
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="patriotic-overlay"></div>
      <div className="login-card patriotic-card">
        <div className="login-header">
          <div className="login-icon patriotic-icon">
            <UserPlus size={32} />
          </div>
          <h1 className="patriotic-title">Join the Movement</h1>
          <p>The Glimpses of Bharat</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Bharat Vasi"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@bharat.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <input
                id="password"
                type={showPass ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
              />
              <button
                type="button"
                className="toggle-pass"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Account Type</label>
            <div className="role-select-wrap" style={{width: "100%"}}>
              <select id="role" value={formData.role} onChange={handleChange} className="role-select" style={{width: "100%", paddingRight: "10px"}}>
                <option value="user">Citizen (User)</option>
                <option value="contributor">Contributor</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full patriotic-btn" disabled={loading}>
            {loading ? <><Loader size={16} className="spin" /> Joining...</> : "Sign Up"}
          </button>
          
          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
