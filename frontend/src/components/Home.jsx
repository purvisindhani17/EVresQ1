import { useNavigate } from "react-router-dom";
import "./auth.css"; // same theme file
import { useEffect } from "react";
import { useInfo } from "../context/InfoProvider";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      {/* LEFT SECTION */}
      <div className="home-left">
        <div className="brand-box">
          <div className="brand-logo">⚡</div>
          <h1 className="brand-title">
            EV<span>resQ</span>
          </h1>
          <p className="brand-tagline">
            Powering EV emergencies, instantly
          </p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="home-right">
        <div className="cta-card">
          <h2>Get Started</h2>
          <p className="cta-subtitle">
            Login or create an account to continue
          </p>

          <button
            className="auth-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="auth-btn"
            onClick={() => navigate("/signup")}
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}
