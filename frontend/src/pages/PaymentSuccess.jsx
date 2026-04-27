import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { CheckCircle, XCircle, Loader } from "lucide-react";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get("session_id");
  const { fetchMe } = useAuth();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState("verifying"); // verifying, success, error

  useEffect(() => {
    if (!session_id) {
      setStatus("error");
      return;
    }

    // Call backend to verify the Stripe session
    api.post("/payment/verify", { session_id })
      .then(async (res) => {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
        await fetchMe();
        setStatus("success");
        setTimeout(() => {
          navigate("/research");
        }, 3000);
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
      });
  }, [session_id, fetchMe, navigate]);

  return (
    <div className="page" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh'}}>
      <div style={{textAlign: 'center', padding: '40px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', maxWidth: '400px'}}>
        {status === "verifying" && (
          <>
            <Loader size={48} className="spin text-accent" style={{margin: '0 auto 16px'}} />
            <h2 style={{fontSize: '24px', fontWeight: 'bold'}}>Verifying Payment...</h2>
            <p style={{color: 'var(--text-secondary)', marginTop: '8px'}}>Please wait while we confirm your transaction.</p>
          </>
        )}
        
        {status === "success" && (
          <>
            <CheckCircle size={48} color="var(--green)" style={{margin: '0 auto 16px'}} />
            <h2 style={{fontSize: '24px', fontWeight: 'bold'}}>Payment Successful!</h2>
            <p style={{color: 'var(--text-secondary)', marginTop: '8px'}}>You are now a Premium Member. Redirecting to Research Portal...</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle size={48} color="var(--red)" style={{margin: '0 auto 16px'}} />
            <h2 style={{fontSize: '24px', fontWeight: 'bold'}}>Verification Failed</h2>
            <p style={{color: 'var(--text-secondary)', marginTop: '8px'}}>We couldn't verify your payment. Please contact support.</p>
            <button className="btn btn-primary" style={{marginTop: '24px'}} onClick={() => navigate("/research")}>Return to Portal</button>
          </>
        )}
      </div>
    </div>
  );
}
