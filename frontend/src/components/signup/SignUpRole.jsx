import { useNavigate } from "react-router-dom";

const SignUpRole = ({ setRole }) => {
  const navigate = useNavigate();
  return (
    <>
      <>
        <button
  style={styles.backBtn}
  onClick={() => navigate("/")}
>
  ← Home
</button>

        <h2 style={styles.heading}>Create Your Account</h2>
        <p style={styles.subtitle}>
          Choose how you want to join the EVresQ community
        </p>

        <div style={styles.grid}>
          {/* EV Owner */}
          <div style={styles.box}>
            <div style={{ ...styles.icon, background: "#e8f0ff" }}>🚗</div>
            <h3>EV Owner</h3>
            <p style={styles.text}>
              Get help when your vehicle needs charging
            </p>
            <button
              style={styles.registerBtn}
              onMouseOver={e => (e.target.style.transform = "scale(1.07)")}
              onMouseOut={e => (e.target.style.transform = "scale(1)")}
              onClick={() => setRole("EVowner")}
            >
              Register
            </button>
          </div>

          {/* Host */}
          <div style={styles.box}>
            <div style={{ ...styles.icon, background: "#e6fff3" }}>🔌</div>
            <h3>Host</h3>
            <p style={styles.text}>
              Share your charger and earn money
            </p>
            <button
              style={styles.registerBtn}
              onMouseOver={e => (e.target.style.transform = "scale(1.07)")}
              onMouseOut={e => (e.target.style.transform = "scale(1)")}
              onClick={() => setRole("host")}
            >
              Register
            </button>
          </div>

          {/* Driver */}
          <div style={styles.box}>
            <div style={{ ...styles.icon, background: "#f3e8ff" }}>🚐</div>
            <h3>Driver</h3>
            <p style={styles.text}>
              Help EV owners and earn on your schedule
            </p>
            <button
              style={styles.registerBtn}
              onMouseOver={e => (e.target.style.transform = "scale(1.07)")}
              onMouseOut={e => (e.target.style.transform = "scale(1)")}
              onClick={() => setRole("driver")}
            >
              Register
            </button>
          </div>
        </div>
      </>
    </>
  );
};

export default SignUpRole;

/* ---------- STYLES ---------- */
const styles = {
 

  card: {
    background: "#ffffffff",
    width: "100%",
    maxWidth: "900px",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
    position: "relative",
    textAlign: "center",
  },

  backBtn: {
    position: "absolute",
    top: "20px",
    left: "20px",
    background: "none",
    border: "none",
    fontSize: "15px",
    cursor: "pointer",
    color: "#f1f1f1ff",
    fontWeight: "600",
  },

  heading: {
    marginBottom: "8px",
  },

  subtitle: {
    color: "#6b7280",
    marginBottom: "30px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },

  box: {
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "25px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  icon: {
    width: "60px",
    height: "60px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    marginBottom: "15px",
  },

  text: {
    color: "#6b7280",
    fontSize: "14px",
    marginBottom: "20px",
    textAlign: "center",
  },

  registerBtn: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "10px 26px",
    borderRadius: "999px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "0.3s ease",
  },
};
