import React, { useState, useRef, useEffect } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const { login } = useAuth();

    /* -------------------------------
       ⏲ Countdown Timer
    -------------------------------- */
    useEffect(() => {
        if (resendTimer <= 0) return;

        const interval = setInterval(() => {
            setResendTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [resendTimer]);

    /* -------------------------------
       🔢 Handle OTP Input
    -------------------------------- */
    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    /* -------------------------------
       🔐 VERIFY OTP
    -------------------------------- */
    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const admin_id = localStorage.getItem("pending_admin_id");
        const code = otp.join("");

        if (!admin_id) {
            setError("No admin session found. Please log in again.");
            setLoading(false);
            return;
        }

        try {
            const res = await API.post("/admin/verify-2fa", { admin_id, code });

            if (res.data.token) {
                // ✅ Store token
                localStorage.setItem("admin_token", res.data.token);
                localStorage.removeItem("pending_admin_id");
                localStorage.removeItem("pending_admin_user");

                // ✅ Update AuthContext so app knows admin is logged in
                login(
                    { id: res.data.admin.id, username: res.data.admin.username }, // user object
                    "admin", // role
                    res.data.token
                );

                navigate("/admin/dashboard"); // ✅ go to dashboard
                return;
            }

            setError("Invalid 2FA code.");
        } catch (err) {
            setError(err.response?.data?.error || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    /* -------------------------------
       🔁 RESEND 2FA
    -------------------------------- */
    const handleResend = async () => {
        const username = localStorage.getItem("pending_admin_user");

        if (!username) {
            setError("No admin session found.");
            return;
        }

        try {
            await API.post("/admin/login", { username, password: "resend" });
            setResendTimer(30);
            setError("");
        } catch (err) {
            setError("Failed to resend code.");
        }
    };

    /* -------------------------------
       UI
    -------------------------------- */
    return (
        <div className="t-body">
            <div className="container" style={{ maxWidth: 400, marginTop: 50 }}>

                <h3>Admin 2FA Verification</h3>
                <p>Please enter the 6-digit code sent to your email.</p>

                <form onSubmit={handleVerify} style={{ textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: 15 }}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => (inputRefs.current[index] = el)}
                                style={{
                                    width: "45px",
                                    height: "55px",
                                    fontSize: "24px",
                                    textAlign: "center",
                                    borderRadius: "8px",
                                    border: "1px solid #ccc",
                                }}
                            />
                        ))}
                    </div>

                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? "Verifying..." : "Verify"}
                    </button>

                    <div style={{ marginTop: 10 }}>
                        {resendTimer > 0 ? (
                            <span style={{ color: "#777" }}>
                                Resend code in {resendTimer}s
                            </span>
                        ) : (
                            <button
                                type="button"
                                className="btn btn-link"
                                onClick={handleResend}
                                style={{ padding: 0 }}
                            >
                                Resend Code
                            </button>
                        )}
                    </div>
                </form>

                <p style={{ fontSize: 12, marginTop: 10 }}>
                    Back to <a href="/">Login</a>
                </p>

                {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
            </div>
        </div>
    );
}
