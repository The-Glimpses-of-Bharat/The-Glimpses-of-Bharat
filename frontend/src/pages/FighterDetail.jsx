import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeft, Calendar, Shield, Share2, Heart, Send, X, MessageSquarePlus, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

export default function FighterDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [fighter, setFighter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Feature states
    const [isHero, setIsHero] = useState(false);
    const [showSuggestModal, setShowSuggestModal] = useState(false);
    const [suggestion, setSuggestion] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const fetchFighter = async () => {
            try {
                const { data } = await api.get(`/fighters/${id}`);
                setFighter(data);

                // Check if marked as hero in local storage
                const heroes = JSON.parse(localStorage.getItem("bharat_heroes") || "[]");
                setIsHero(heroes.includes(id));
            } catch (err) {
                console.error(err);
                setError("Failed to load freedom fighter details.");
            } finally {
                setLoading(false);
            }
        };
        fetchFighter();
    }, [id]);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const toggleHero = () => {
        const heroes = JSON.parse(localStorage.getItem("bharat_heroes") || "[]");
        let newHeroes;
        if (isHero) {
            newHeroes = heroes.filter(h => h !== id);
        } else {
            newHeroes = [...heroes, id];
        }
        localStorage.setItem("bharat_heroes", JSON.stringify(newHeroes));
        setIsHero(!isHero);
    };

    const handleShare = async () => {
        const shareData = {
            title: `Freedom Fighter: ${fighter.name}`,
            text: `Read about the valor of ${fighter.name} on The Glimpses of Bharat.`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
            }
        } catch (err) {
            console.error("Error sharing", err);
        }
    };

    const handleSubmitSuggestion = async (e) => {
        e.preventDefault();
        if (!user) {
            showToast("Please login to suggest info", "error");
            navigate("/login");
            return;
        }
        if (!suggestion.trim()) return;

        setSubmitting(true);
        try {
            await api.post(`/contributions/suggest/${id}`, { suggestion });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setSuggestion("");
                setShowSuggestModal(false);
            }, 2500);
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to send suggestion", "error");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-full">
                <div className="spinner" />
            </div>
        );
    }

    if (error || !fighter) {
        return (
            <div className="container" style={{ paddingTop: "100px", textAlign: "center" }}>
                <h2>{error || "Freedom Fighter not found"}</h2>
                <Link to="/explore" className="btn btn-primary" style={{ marginTop: "20px" }}>
                    Back to Explore
                </Link>
            </div>
        );
    }

    return (
        <div className="fighter-detail-page" style={{ minHeight: "100vh", background: "var(--bg-1)" }}>
            {/* Toast Notification */}
            {toast && (
                <div className={`toast toast--${toast.type}`} style={{
                    position: "fixed",
                    top: "20px",
                    right: "20px",
                    zIndex: 1000,
                    animation: "slideIn 0.3s ease-out"
                }}>
                    {toast.msg}
                </div>
            )}

            <header className="home-header">
                <div className="container header-container">
                    <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                        <Shield size={32} className="text-accent" />
                        <span>The Glimpses of Bharat</span>
                    </div>
                    <nav className="home-nav">
                        <Link to="/explore" className="btn btn-ghost">
                            <ArrowLeft size={16} /> Back to Explore
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="container" style={{ padding: "40px 20px", maxWidth: "900px" }}>
                <div className="fighter-detail-card" style={{
                    background: "var(--bg-card)",
                    borderRadius: "24px",
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                }}>
                    <div className="fighter-detail-hero" style={{ position: "relative", height: "400px" }}>
                        {fighter.image ? (
                            <img
                                src={fighter.image}
                                alt={fighter.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                            />
                        ) : (
                            <div style={{
                                width: "100%",
                                height: "100%",
                                background: "linear-gradient(135deg, var(--accent-light), var(--accent))",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "120px",
                                color: "white",
                                fontWeight: "800"
                            }}>
                                {fighter.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: "40px",
                            background: "linear-gradient(to top, rgba(10, 12, 18, 0.9), transparent)",
                            color: "white"
                        }}>
                            <h1 style={{ fontSize: "48px", fontWeight: "800", marginBottom: "8px" }}>{fighter.name}</h1>
                            <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "18px", opacity: 0.9 }}>
                                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <Calendar size={18} /> {fighter.birthYear || "?"} — {fighter.deathYear || "?"}
                                </span>
                                <span className={`badge badge-${fighter.status || "approved"}`}>{fighter.status || "Historical"}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: "40px" }}>
                        <div className="detail-section" style={{ marginBottom: "40px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                <h2 style={{ fontSize: "24px", color: "var(--accent)", display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span style={{ width: "4px", height: "24px", background: "var(--accent)", borderRadius: "2px" }}></span>
                                    Biography
                                </h2>
                                <button
                                    className="btn btn-ghost"
                                    style={{ gap: "8px", fontSize: "14px", color: "var(--accent)" }}
                                    onClick={() => setShowSuggestModal(true)}
                                >
                                    <MessageSquarePlus size={18} /> Suggest Edit
                                </button>
                            </div>
                            <p style={{ fontSize: "18px", lineHeight: "1.7", color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>
                                {fighter.description}
                            </p>
                        </div>

                        {fighter.contributions && (
                            <div className="detail-section">
                                <h2 style={{ fontSize: "24px", color: "var(--accent)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span style={{ width: "4px", height: "24px", background: "var(--accent)", borderRadius: "2px" }}></span>
                                    Key Contributions
                                </h2>
                                <div style={{
                                    background: "rgba(255, 153, 51, 0.05)",
                                    padding: "30px",
                                    borderRadius: "16px",
                                    border: "1px dashed rgba(255, 153, 51, 0.3)",
                                    fontSize: "18px",
                                    lineHeight: "1.7",
                                    color: "var(--text-primary)"
                                }}>
                                    {fighter.contributions}
                                </div>
                            </div>
                        )}

                        <div style={{
                            marginTop: "40px",
                            paddingTop: "30px",
                            borderTop: "1px solid var(--border)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <div style={{ display: "flex", gap: "12px" }}>
                                <button
                                    className={`btn ${isHero ? "btn-primary" : "btn-ghost"}`}
                                    style={{ gap: "8px" }}
                                    onClick={toggleHero}
                                >
                                    <Heart size={18} fill={isHero ? "currentColor" : "none"} />
                                    {isHero ? "My Hero" : "Mark as Hero"}
                                </button>
                                <button
                                    className="btn btn-ghost"
                                    style={{ gap: "8px" }}
                                    onClick={handleShare}
                                >
                                    <Share2 size={18} /> Share History
                                </button>
                            </div>
                            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                                Source: The Glimpses of Bharat Archive
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Suggest Edit Modal */}
            {showSuggestModal && (
                <div className="modal-overlay" onClick={() => setShowSuggestModal(false)} style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0, 0, 0, 0.85)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2000
                }}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{
                        maxWidth: "600px",
                        width: "90%",
                        background: "var(--bg-card)",
                        borderRadius: "24px",
                        border: "1px solid var(--border)",
                        padding: "32px",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                        animation: "modalFadeIn 0.3s ease-out"
                    }}>
                        <div className="modal-header">
                            <h2>Suggest Edit / Extra Info</h2>
                            <button className="modal-close" onClick={() => !submitting && !success && setShowSuggestModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        {success ? (
                            <div style={{ padding: "40px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--green-dim)", color: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <CheckCircle size={32} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Suggestion Sent!</h3>
                                    <p style={{ color: "var(--text-secondary)" }}>Thank you for contributing to Bharat's history. Our admin team will review it soon.</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitSuggestion} className="modal-form">
                                <p style={{ color: "var(--text-secondary)", marginBottom: "16px", fontSize: "14px" }}>
                                    Help us improve the history of <strong>{fighter.name}</strong>. Your suggestion will be reviewed by an admin.
                                </p>
                                <div className="form-group">
                                    <label>Add missing information or corrections</label>
                                    <textarea
                                        value={suggestion}
                                        onChange={(e) => setSuggestion(e.target.value)}
                                        placeholder="e.g. He also led the XYZ movement in 19XX..."
                                        rows={6}
                                        required
                                        style={{ width: "100%", background: "var(--bg-1)", border: "1px solid var(--border)", color: "white", padding: "12px", borderRadius: "8px" }}
                                    />
                                </div>
                                <div className="modal-actions" style={{ marginTop: "20px" }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowSuggestModal(false)} disabled={submitting}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={submitting} style={{ gap: "8px" }}>
                                        {submitting ? "Sending..." : <><Send size={16} /> Send Request</>}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <footer className="home-footer" style={{ marginTop: "60px" }}>
                <p>© 2026 The Glimpses of Bharat • Preserving the Valor of Our Heroes</p>
            </footer>
        </div>
    );
}
