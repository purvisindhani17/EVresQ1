import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useInfo} from "../../context/InfoProvider";


export default function DriverForm({ setRole }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    licenseNumber: "",
    vehicleNumber: "",
    preferredLocation: "",
  });
  
const navigate = useNavigate();
const { login } = useInfo();


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:8000/api/driver/",
      form
    );

    login({
      token: res.data.token,
      role: "driver",
      id: res.data._id,
    });

    navigate("/driver/dashboard");
  } catch (err) {
    alert("Driver signup failed");
  }
};


  return (
    <>
      {/* SINGLE WHITE BOX */}
      <form
        onSubmit={handleSubmit}
        style={{
          width: "350px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          padding: "30px 25px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => setRole("")}
          style={{
            marginBottom: "10px",
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: "#f0f0f0",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          ← Back to Role Selection
        </button>

        <h2 style={{ textAlign: "center", marginBottom: "5px" }}>Driver Signup</h2>
        <p style={{ textAlign: "center", color: "#555", marginBottom: "15px", fontSize: "14px" }}>
          Help EV owners and earn on your schedule
        </p>

        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          name="phone"
          type="text"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          name="licenseNumber"
          type="text"
          placeholder="License Number"
          value={form.licenseNumber}
          onChange={handleChange}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          name="vehicleNumber"
          type="text"
          placeholder="Vehicle Number"
          value={form.vehicleNumber}
          onChange={handleChange}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          name="preferredLocation"
          type="text"
          placeholder="Preferred Location"
          value={form.preferredLocation}
          onChange={handleChange}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        <button
          type="submit"
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "5px",
          }}
        >
          Create Account
        </button>
      </form>
    </>
  );
}
