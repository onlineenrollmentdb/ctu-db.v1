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
  const [resetCooldown, setResetCooldown] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  const { login, user, role } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Redirect after login
  useEffect(() => {
    if (!user || !role) return;
    if (role === "admin" || role === "faculty") navigate("/admin/dashboard");
    else if (role === "student") navigate("/home");
  }, [user, role, navigate]);

  // Forgot password cooldown timer
  useEffect(() => {
    if (resetCooldown <= 0) return;
    const interval = setInterval(() => setResetCooldown(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [resetCooldown]);

  // ---------------------- HANDLE LOGIN ----------------------
  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const loginEndpoints = [
      { url: "/admin/login", type: "admin", payload: { id: userId, password } },
      { url: "/faculty/login", type: "faculty", payload: { id: userId, password } },
      { url: "/auth/login", type: "student", payload: { student_id: userId, password } },
    ];

    try {
      for (const ep of loginEndpoints) {
        try {
          const res = await API.post(ep.url, ep.payload);

          // --------- ADMIN LOGIN ---------
          if (ep.type === "admin") {
            if (res.data.require2FA) {
              // 2FA enabled
              localStorage.setItem("pending_admin_id", res.data.admin_id);
              navigate("/auth");
              return;
            } else {
              // 2FA disabled
              const userData = {
                id: res.data.admin.id,
                username: res.data.admin.username,
                ...res.data.admin
              };
              login(userData, ep.type, res.data.token);
              navigate("/admin/dashboard"); // now it will redirect
              return;
            }
          }

          // --------- FACULTY LOGIN ---------
          if (ep.type === "faculty") {
            const userData = res.data.user;
            login(userData, ep.type, res.data.token);
            navigate("/admin/dashboard");
            return;
          }

          // --------- STUDENT LOGIN ---------
          if (ep.type === "student") {
            const userData = res.data.student;
            login(userData, ep.type, res.data.token);
            navigate("/home");
            return;
          }

        } catch (err) {
          // Show error only on last endpoint
          if (ep === loginEndpoints[loginEndpoints.length - 1]) {
            setError(err.response?.data?.error || "Login failed. Check credentials.");
          }
        }
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false); // ✅ ensures loading spinner is removed
    }
  }, [userId, password, login, navigate]);

  // ---------------------- HANDLE FORGOT PASSWORD ----------------------
  const handleForgotPassword = useCallback(async () => {
    if (!userId) {
      addToast("Enter your ID first.", "warning");
      return;
    }

    // Prevent spam
    if (resetCooldown > 0) {
      addToast(
        "Too many requests in a short time. Please wait a moment.",
        "warning"
      );
      return;
    }

    try {
      setIsResetting(true);
      setResetCooldown(30); // start 30s cooldown
      await API.post("/students/forgot-password", { student_id: userId });
      addToast("Password reset link sent to your email.", "success");
    } catch (err) {
      addToast(err.response?.data?.error || "Failed to send reset link.", "error");
    } finally {
      setIsResetting(false);
    }
  }, [userId, resetCooldown, addToast]);

  // ---------------------- RENDER ----------------------
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
            type="number"
            placeholder="ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value.slice(0, 7))}
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
          <i onClick={() => setShowPassword(prev => !prev)} role="button">
            {showPassword ? "Hide" : "Show"}
          </i>
        </div>

        <div className="forgot-section">
          <span>Forgot your password? </span>
          <button
            type="button"
            className="link-button"
            onClick={handleForgotPassword}
            disabled={isResetting || resetCooldown > 0}
          >
            {isResetting
              ? "Sending..."
              : resetCooldown > 0
              ? `Wait (${resetCooldown})`
              : "Reset Pass"}
          </button>
        </div>

        <p className="signup-text">
          Sign-up here for CTU students only <a href="/signup" className="link-button">Sign-up</a>
        </p>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Please wait..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
