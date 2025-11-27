import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import ctuLogo from "../img/ctu_logo.png";
import keyIcon from "../img/key.png";
import "../css/LoginPage.css"; // use the same CSS as login page

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [confirmError, setConfirmError] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Validate password
  useEffect(() => {
    const errors = [];
    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter");
    if (!/\d/.test(password)) errors.push("At least one number");
    if (!/[\W_]/.test(password)) errors.push("At least one special character");

    setPasswordErrors(errors);

    if (confirmPassword && password !== confirmPassword) {
      setConfirmError("Passwords do not match.");
    } else {
      setConfirmError("");
    }

    setIsValid(errors.length === 0 && password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setMessage("");
    setError("");

    try {
      const res = await API.post("/students/reset-password", {
        token,
        password,
        confirmPassword,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="t-body">
      <form className="t-container shadow-lg" onSubmit={handleSubmit}>
        <img src={ctuLogo} alt="CTU Logo" className="ctu-logo" />
        <h2 className="login-title">Reset Your Password</h2>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Password Input */}
        <div className="input-with-icon password-container">
          <img src={keyIcon} alt="Key Icon" className="input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <i onClick={() => setShowPassword((prev) => !prev)} role="button">
            {showPassword ? "Hide" : "Show"}
          </i>
        </div>
        <ul>
          {passwordErrors.map((err, idx) => (
            <li key={idx} className="invalid">
              ✗ {err}
            </li>
          ))}
          {password && passwordErrors.length === 0 && (
            <li className="valid">✔ Good password</li>
          )}
        </ul>

        {/* Confirm Password Input */}
        <div className="input-with-icon password-container">
          <img src={keyIcon} alt="Key Icon" className="input-icon" />
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <i onClick={() => setShowConfirm((prev) => !prev)} role="button">
            {showConfirm ? "Hide" : "Show"}
          </i>
        </div>
        <p style={{ fontSize: 12, marginTop: 10, textAlign: "left" }}>
            Back to <a href="/">Login</a>
        </p>
        {confirmError && <p className="invalid">{confirmError}</p>}

        <button type="submit" className="btn t-btn" disabled={!isValid}>
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
