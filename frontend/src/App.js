import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import RouteDecider from "./components/RouteDecider";
import EVownerDashboard from "./components/EVownerDashboard";
import HostDashboard from "./components/HostDashboard";
import DriverDashboard from "./components/DriverDashboard";
import ProfileOfHost from "./components/ProfileOfHost";
import ProfileOfEVowner from "./components/ProfileOfEVowner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/decide" element={<RouteDecider />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/EVowner/dashboard" element={<EVownerDashboard />} />
        <Route path="/host/dashboard" element={<HostDashboard />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="/host/evowner/:bookingId" element={<ProfileOfEVowner />} />
<Route path="/ev/host/:hostId" element={<ProfileOfHost />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
