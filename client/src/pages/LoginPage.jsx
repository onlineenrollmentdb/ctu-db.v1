import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import API from "../api/api";
import "../css/LoginPage.css";

// Lazy load images (optional)
import ctuLogo from "../img/ctu_logo.webp";
import userIcon from "../img/user.webp";
import keyIcon from "../img/key.webp";

const LoginPage = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, user, role } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Redirect after login
  useEffect(() => {
    if (!user || !role) return;
    if (role === "admin" || role === "faculty") navigate("/admin/dashboard");
    else if (role === "student") navigate("/home");
  }, [user, role, navigate]);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const loginEndpoints = [
      { url: "/admin/login", type: "admin", payload: { username: userId, password } },
      { url: "/faculty/login", type: "faculty", payload: { username: userId, password } },
      { url: "/auth/login", type: "student", payload: { student_id: userId, password } },
    ];

    for (const ep of loginEndpoints) {
      try {
        const res = await API.post(ep.url, ep.payload);
        if (ep.type === "admin" && res.data.require2FA) {
          localStorage.setItem("pending_admin_id", res.data.admin_id);
          navigate("/auth");
          return;
        }

        const userData = ep.type === "student" ? res.data.student : res.data.user;
        login(userData, ep.type, res.data.token);
        return;
      } catch (err) {
        if (ep === loginEndpoints[loginEndpoints.length - 1]) {
          setError(err.response?.data?.error || "Login failed. Check credentials.");
        }
      }
    }

    setLoading(false);
  }, [userId, password, login, navigate]);

  const handleForgotPassword = useCallback(async () => {
    if (!userId) return addToast("Enter your ID first.", "warning");

    try {
      setLoading(true);
      await API.post("/students/forgot-password", { student_id: userId });
      addToast("Password reset link sent to your email (check spam folder).", "success");
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.error || "Failed to send reset link.", "error");
    } finally {
      setLoading(false);
    }
  }, [userId, addToast]);

  return (
    <div className="t-body">
      <form className="t-container shadow-lg" onSubmit={handleLogin}>
        <img src={ctuLogo} alt="CTU Logo" className="ctu-logo" loading="lazy" />
        <h1 className="login-title">CTU-DB</h1>
        <h3>Online Enrollment System</h3>

        {error && <p className="error-text">{error}</p>}

        <div className="input-with-icon">
          <img src={userIcon} alt="User Icon" className="input-icon" loading="lazy" />
          <input
            type="text"
            placeholder="ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>

        <div className="input-with-icon password-container">
          <img src={keyIcon} alt="Key Icon" className="input-icon" loading="lazy" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <i onClick={() => setShowPassword((prev) => !prev)} role="button">
            {showPassword ? "Hide" : "Show"}
          </i>
        </div>

        <div className="forgot-section">
          <span>Forgot your password? </span>
          <button
            type="button"
            className="change-password-link"
            onClick={handleForgotPassword}
            disabled={loading}
          >
            Reset it here
          </button>
        </div>

        <p className="signup-text">
          <a href="/signup">Signup here</a> to activate account
        </p>

        <button className="btn t-btn" type="submit" disabled={loading}>
          {loading ? "Please wait..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
