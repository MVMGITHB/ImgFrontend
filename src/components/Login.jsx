import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://panel.gtright.in/api/admin/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.message || "Login failed");
      } else {
        setErrorMsg("Server not responding");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #4f46e5, #2563eb, #9333ea)",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          padding: "40px",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <h1 style={{ fontSize: "28px", marginBottom: "5px" }}>
            Admin Panel
          </h1>
          <p style={{ color: "#666", fontSize: "14px" }}>
            Sign in to access dashboard
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              background: "#fee2e2",
              color: "#dc2626",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px",
              fontSize: "14px",
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontSize: "14px", color: "#555" }}>
              Email Address
            </label>

            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "14px", color: "#555" }}>
              Password
            </label>

            <div style={{ display: "flex", marginTop: "5px" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "6px 0 0 6px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderLeft: "none",
                  background: "#f3f4f6",
                  cursor: "pointer",
                  borderRadius: "0 6px 6px 0",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#888",
            marginTop: "20px",
          }}
        >
          © {new Date().getFullYear()} Admin Panel
        </p>
      </div>
    </div>
  );
};

export default Login;