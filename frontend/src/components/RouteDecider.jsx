import { Navigate } from "react-router-dom";
import { useInfo } from "../context/InfoProvider";

const RouteDecider = () => {
  const { token, role, loading } = useInfo();

  if (loading) return null; 

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role === "host") return <Navigate to="host/dashboard" replace />;
  if (role === "EVowner") return <Navigate to="EVowner/dashboard" replace />;
  if (role === "driver") return <Navigate to="driver/dashboard" replace />;

  return <Navigate to="/" replace />;
};

export default RouteDecider;