import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import MapView3 from "./MapView";

export default function Profileofevownerfordriver() {
  const { evOwnerId } = useParams();
  const { state } = useLocation(); // 👈 booking info
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [requests, setRequests] = useState([]);
  const [owner, setOwner] = useState(null);
  const [status, setStatus] = useState(state?.status);
  const bookingId = state?.bookingId;
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/driver/evowner/${evOwnerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOwner(res.data))
      .catch(console.error);
  }, [evOwnerId, token]);

  /* ================== FETCH DRIVER REQUESTS ================== */
  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    const res = await axios.get(
      "http://localhost:8000/api/driver/requests",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setRequests(res.data);
  };

  /* ================== FIND CURRENT BOOKING ================== */
  const booking = requests.find(
    (r) => r.EVowner?._id === evOwnerId
  );

  /* ================== UPDATE STATUS ================== */
  const updateStatus = async (endpoint) => {
    await axios.patch(
      `http://localhost:8000/api/driver/${endpoint}/${bookingId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const newStatus =
      endpoint === "accept"
        ? "accepted"
        : endpoint === "start"
        ? "on_the_way"
        : endpoint === "complete"
        ? "completed"
        : "rejected";

    setStatus(newStatus);

    if (newStatus === "completed") {
    // ✅ DELETE booking on backend after completion
    try {
        await axios.delete(
            `http://localhost:8000/api/driver/delete-booking/${bookingId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setTimeout(() => navigate("/driver/dashboard"), 1500);
    } catch (err) {
        console.error("Delete failed:", err.response?.data || err.message);
    }
  }
  };

  if (!owner) return <p>Loading EV Owner...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>⚡ EV Owner Profile</h1>

      <p><b>Name:</b> {owner.name}</p>
      <p><b>Phone:</b> {owner.phone}</p>
      <p><b>Email:</b> {owner.email}</p>

      <hr />

      <p><b>Status:</b> {status}</p>

      {status === "requested" && (
        <>
          <button onClick={() => updateStatus("accept")}>Accept</button>
          <button onClick={() => updateStatus("reject")}>Reject</button>
        </>
      )}

      {status === "accepted" && (
        <button onClick={() => updateStatus("start")}>On The Way</button>
      )}

      {status === "on_the_way" && (
        <button onClick={() => updateStatus("complete")}>Completed</button>
      )}

      {status === "completed" && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          ✅ Trip Completed. Redirecting...
        </p>
      )}

      {/* ================== MAP ================== */}
      {booking?.pickupLocation && (
        <>
          <h3>📍 EV Owner Location</h3>
          <MapView3
            latitude={booking.pickupLocation.latitude}
            longitude={booking.pickupLocation.longitude}
          />
        </>
      )}
    </div>
  );
}
