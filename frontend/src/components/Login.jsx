import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { useInfo } from "../context/InfoProvider";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useInfo();

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:8000/api/auth/login", // 🔴 backend login route
      { email, password }
    );

    login({
      token: res.data.token,
      role: res.data.role,
      id: res.data._id,
    });

    if (res.data.role === "EVowner") {
      navigate("/EVowner/dashboard");
    } else if (res.data.role === "host") {
      navigate("/host/dashboard");
    } else if (res.data.role === "driver") {
      navigate("/driver/dashboard");
    } else {
      navigate("/");
    }

  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};

  return (
    <div className="auth-bg">
      <div className="auth-wrapper">
        <div className="auth-card">

          {/* Back Button */}
          <button className="back-btn" onClick={() => navigate("/")}>
            <FaArrowLeft /> Home
          </button>

          <h2>Welcome Back</h2>
          <p className="auth-subtitle">
            Login to continue to EVresQ
          </p>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="auth-input-wrapper">
              <FaEnvelope className="auth-icon" />
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="auth-input-wrapper">
              <FaLock className="auth-icon" />
              <input
                className="auth-input"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button className="auth-btn" type="submit">
              Sign In
            </button>
          </form>

          <p className="auth-toggle">
            Don’t have an account?
            <span onClick={() => navigate("/signup")}> Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
}
