import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import MapView3 from "./MapView";
import { useNavigate } from "react-router-dom";

export default function ProfileOfDriver() {
  const { state } = useLocation();
  const { driverId } = useParams();
  const [tripStatus, setTripStatus] = useState("");
  const [redirected, setRedirected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (tripStatus === "completed" && !redirected) {
      setRedirected(true);
      setTimeout(() => {
        navigate("/evowner/dashboard", { replace: true });
      }, 3000); // 3 seconds to let them see the "Success" message
    }
  }, [tripStatus, redirected, navigate]);
  
/* ================== UPDATED FETCH LOGIC ================== */
useEffect(() => {
  if (redirected) return;
  const token = localStorage.getItem("token");

  const fetchTripStatus = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/EVowner/my-driver-booking/${driverId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 1. If the driver deleted the record, the status might be 404
      if (res.status === 404) {
        console.log("Booking record deleted by driver, marking as completed.");
        setTripStatus("completed");
        return;
      }

      const booking = await res.json();

      // 2. If the response is empty or status is missing, assume it's done
      if (!booking || Object.keys(booking).length === 0) {
        setTripStatus("completed");
      } else if (booking.status) {
        setTripStatus(booking.status);
      }
      
    } catch (err) {
      // 3. If the fetch fails entirely (e.g. server error because record is gone)
      console.error("Trip record no longer exists:", err);
      setTripStatus("completed");
    }
  };

  fetchTripStatus();
  const interval = setInterval(fetchTripStatus, 4000); // Polling slightly faster

  return () => clearInterval(interval);
}, [driverId, redirected]);


  if (!state) return <p>No driver assigned</p>;

  const statusMap = {
  accepted: {
    text: "✔ Driver Approved",
    style: styles.charging,
  },
  on_the_way: {
    text: "🚐 Driver is on the way",
    style: styles.charging,
  },
  completed: {
    text: "✅ Trip completed",
    style: styles.completed,
  },
};

  const { driver } = state;
const statusUI = statusMap[tripStatus] || {
  text: "⏳ Waiting...",
  style: styles.charging,
};

  return (
    <div style={styles.page}>
      {/* LEFT SIDE */}
      <div style={styles.left}>
        <h1 style={styles.heading}>🚗 Driver Location</h1>

        <div style={styles.mapBox}>
          <h3>📍 Live Driver Location</h3>
          {driver && (
            <MapView3
              latitude={driver.latitude}
              longitude={driver.longitude}
            />
          )}
        </div>

        <div style={styles.locationBox}>
          <b>Vehicle No:</b> {driver.vehicleNumber}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.right}>
        <div style={styles.profileCard}>
          <div style={styles.avatar}>🚗</div>

          <h2 style={styles.name}>{driver.name}</h2>
          <p style={styles.phone}>{driver.phone}</p>

          <div style={styles.vehicle}>
            🚘 {driver.vehicleNumber}
          </div>

          <div style={styles.statusBox}>
            <div style={{ ...styles.statusBadge, ...statusUI.style }}>
              {statusUI.text}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES (EV OWNER JAISE) ================= */
const styles = {
  page: {
    display: "flex",
    gap: "40px",
    padding: "30px",
    background: "#f4f6fb",
    minHeight: "100vh",
    fontFamily: "Arial",
  },

  heading: {
    marginBottom: "15px",
  },

  left: {
    flex: 1,
  },

  right: {
    marginTop: "80px",
    width: "380px",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  mapBox: {
    background: "#fff",
    padding: "15px",
    borderRadius: "14px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    marginBottom: "15px",
  },

  locationBox: {
    background: "#fff",
    padding: "12px",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
  },

  profileCard: {
    width: "280px",
    background: "#fff",
    padding: "22px 20px",
    borderRadius: "16px",
    boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
    textAlign: "center",
    marginTop: "60px",
  },

  avatar: {
    width: "78px",
    height: "78px",
    borderRadius: "50%",
    background: "#e3f2fd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "34px",
    margin: "0 auto 12px",
  },

  name: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "6px",
  },

  phone: {
    fontSize: "15px",
    color: "#444",
    marginBottom: "10px",
  },

  vehicle: {
    display: "inline-block",
    padding: "6px 14px",
    background: "#eef2ff",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "500",
    marginBottom: "16px",
  },

  statusBox: {
    marginTop: "6px",
  },

  statusBadge: {
    padding: "10px",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "14px",
  },

  charging: {
    background: "#e3f2fd",
    color: "#1565c0",
  },

  completed: {
    background: "#e6f7ec",
    color: "#2e7d32",
  },
};
