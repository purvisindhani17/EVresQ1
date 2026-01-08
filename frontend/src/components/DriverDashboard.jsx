import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DriverDashboard.css";

export default function DriverDashboard() {
  const [requests, setRequests] = useState([]);
  const [mlResults, setMlResults] = useState({}); 
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 4000);
    return () => clearInterval(interval);
  }, []);

  
  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/driver/requests",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRequests(res.data || []);

      
      res.data?.forEach((r) => {
      if (
        r.pickupLocation?.latitude &&
        r.pickupLocation?.longitude &&
        !mlResults[r._id]   // ✅ prevent duplicate ML calls
      ) {
        callML(
         r._id,
          Number(r.pickupLocation.latitude),
          Number(r.pickupLocation.longitude)
      );
     }
    });


    } catch (err) {
      console.error(err);
    }
  };

 
  const callML = async (bookingId, lat, lon) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/rescue",   
        {
          ev_lat: lat,
          ev_lon: lon,
        },
         {
        timeout: 5000, // ✅ prevents UI freeze
        }
      );

      
      setMlResults((prev) => ({
        ...prev,
        [bookingId]: res.data,
      }));

    } catch (error) {
      console.error("ML Error:", error);
    }
  };

  return (
    <div className="driver-dashboard">
      <div className="driver-header">
        <h1>🚐 Driver Dashboard</h1>
        <p>
          Logged in as <b>Driver</b>
        </p>
      </div>

      <h2 className="req-title">Pickup Requests</h2>

      <div className="req-grid">
        {requests.length === 0 ? (
          <p className="no-req">No requests yet</p>
        ) : (
          requests
            .filter((r) => r.EVowner)
            .map((r) => {
              const ml = mlResults[r._id]; 

              return (
                <div
                  className="req-card"
                  key={r._id}
                  onClick={() =>
                    navigate(`/driver/evowner/${r.EVowner._id}`, {
                      state: { bookingId: r._id, status: r.status },
                    })
                  }
                >
                  <div className="req-avatar">🚗</div>

                  <div className="req-info">
                    <h3>{r.EVowner.name}</h3>

                    <p><b>Phone:</b> {r.EVowner.phone}</p>

                    <p>
                      <b>Pickup Latitude:</b>{" "}
                      {r.pickupLocation?.latitude || "N/A"}
                    </p>

                    <p>
                      <b>Pickup Longitude:</b>{" "}
                      {r.pickupLocation?.longitude || "N/A"}
                    </p>

                    <p><b>Status:</b> {r.status}</p>

                    {/* ✅ NEW: ML OUTPUT DISPLAY */}
                    {ml && (
                      <>
                        <p>
                          <b>ML Status:</b> {ml.status}
                        </p>
                          {ml?.status === "INVALID_LOCATION" && (
                            <p style={{ color: "red" }}>
                              ❌ Invalid pickup location
                                    </p>
                          )}

                        {ml.status === "DRIVER_ASSIGNED" && (
                          <>
                            <p>
                              <b>Assigned Driver:</b> {ml.driver_id}
                            </p>
                            <p>
                              <b>Distance:</b> {ml.distance_km} km
                            </p>
                            <p>
                              <b>Rescue Probability:</b> {ml.rescue_probability}
                            </p>
                          </>
                        )}
                      </>
                    )}

                    <div className="req-actions">
                      <button className="view-btn">
                        View EV Owner
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
