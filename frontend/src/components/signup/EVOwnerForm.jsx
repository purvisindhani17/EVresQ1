import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useInfo} from "../../context/InfoProvider";

export default function EVOwnerForm({ setRole }) {
  const [form, setForm] = useState({
  name: "",
  email: "",
  password: "",
  phone: "",
  makeModel: "",
  vehicleNumber: "",
  batteryCapacity: "", 
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
      "http://localhost:8000/api/EVowner",
      form
    );
    console.log("EV OWNER SIGNUP RESPONSE:", res.data);
    login({
      id: res.data._id,
      role: "EVowner",
      token: res.data.token,
    });

    navigate("/EVowner/dashboard");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "EV Owner Signup failed");
  }
};


  return (
    <>
      {/* SIMPLE MEDIUM WHITE BOX */}
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
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: "#f0f0f0",
            cursor: "pointer",
            fontWeight: "500",
            marginBottom: "10px",
          }}
        >
          ← Back to Role Selection
        </button>

        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>EV Owner Signup</h2>

        <input
          name="name"
          type="text"
          placeholder="Full Name"
          required
          onChange={handleChange}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          onChange={handleChange}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          onChange={handleChange}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          name="phone"
          type="text"
          placeholder="Phone Number"
          onChange={handleChange}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          name="makeModel"
          type="text"
          placeholder="Vehicle Model"
          onChange={handleChange}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          name="vehicleNumber"
          type="text"
          placeholder="Vehicle Number"
          onChange={handleChange}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          name="batteryCapacity"
          type="number"
          placeholder="Battery Capacity (kWh)"
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
