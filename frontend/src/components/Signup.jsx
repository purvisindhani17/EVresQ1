import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignUpRole from "./signup/SignUpRole";
import DriverForm from "./signup/DriverForm";
import EVOwnerForm from "./signup/EVOwnerForm";
import HostForm from "./signup/HostForm";
import "./auth.css";
import { useEffect } from "react";
import { useInfo } from "../context/InfoProvider";

export default function Signup() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const { token, role: userRole, loading } = useInfo();

  useEffect(() => {
    if (!loading && token) {
      if (userRole === "host") navigate("/host/dashboard");
      if (userRole === "EVowner") navigate("/EVowner/dashboard");
      if (userRole === "driver") navigate("/driver/dashboard");
    }
  }, [token, userRole, loading, navigate]);

  if (loading) return null;

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        {!role && <SignUpRole setRole={setRole} />}

        {role === "driver" && <DriverForm setRole={setRole} />}
        {role === "EVowner" && <EVOwnerForm setRole={setRole} />}
        {role === "host" && <HostForm setRole={setRole} />}

        <p className="auth-toggle" style={{ textAlign: "center", marginTop: "15px" }}>
          Already have an account?
          <span
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer", color: "#007bff", marginLeft: "5px" }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
