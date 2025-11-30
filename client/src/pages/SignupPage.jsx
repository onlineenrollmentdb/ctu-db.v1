import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import "../css/LoginPage.css";


import ctuLogo from '../img/ctu_logo.webp';
import keyIcon from '../img/key.webp';
import userIcon from "../img/user.webp";

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [student_id, setStudentId] = useState('');
  const [code, setCode] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [confirmError, setConfirmError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [resendTimer, setResendTimer] = useState(0);

  const navigate = useNavigate();

  // Countdown effect
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Step 1: Verify Student ID
  const handleCheckStudent = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await API.post('/auth/check-student', { student_id });
      setSuccess(res.data.message);
      setStep(2);
      setResendTimer(60);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to check student ID.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    if (!/^\d{6}$/.test(code)) {
      setError('Please enter a valid 6-digit code.');
      setLoading(false);
      return;
    }
    try {
      const res = await API.post('/auth/verify-code', { student_id, code });
      setToken(res.data.token);
      setSuccess('Code verified. Please set your password.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Code verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2b: Resend code
  const handleResendCode = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await API.post('/auth/check-student', { student_id });
      setSuccess('Verification code resent.');
      setResendTimer(60);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Password Validation
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
      setConfirmError('');
    }
  }, [password, confirmPassword]);

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    if (passwordErrors.length > 0) {
      setError('Password does not meet requirements.');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    try {
      const res = await API.post('/auth/set-password', { token, password, confirmPassword });
      setSuccess(res.data.message);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to set password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="t-body">
      <form
        className="t-container"
        onSubmit={
          step === 1 ? handleCheckStudent :
          step === 2 ? handleVerifyCode :
          handleSetPassword
        }
      >
        <img src={ctuLogo} alt="CTU Logo" className="ctu-logo"/>
        <h3>
          {step === 1 ? 'Verify Student ID' :
           step === 2 ? 'Enter Verification Code' :
           'Set Your Password'}
        </h3>

        {error && <p className='error-text'>{error}</p>}
        {success && <p className='signup-text' style={{ textAlign: "center", margin: "10px 0" }}>{success}</p>}

        {/* Step 1: Student ID */}
        {step === 1 && (
          <>
            <div className="input-with-icon">
              <img src={userIcon} alt="User Icon" className="input-icon" loading="lazy" />
              <input
                type="number"
                placeholder="ID"
                value={student_id}
                onChange={(e) => {
                  if (e.target.value.length <= 7) {
                    setStudentId(e.target.value);
                  }
                }}
                required
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Checking...' : 'Verify'}
            </button>
          </>
        )}

        {/* Step 2: Verification Code */}
        {step === 2 && (
          <>
          <div className="input-with-icon">
              <img src={keyIcon} alt="Key Icon" className="input-icon" loading="lazy" />
              <input
                type="text"
                placeholder="Enter 6-digit Code"
                value={code}
                onChange={(e) => {
                  if (e.target.value.length <= 6) {
                    setCode(e.target.value);
                  }
                }}
                required
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
            <button
              type="button"
              className={`btn btn-cancel ${resendTimer > 0 || loading ? 'disabled-btn' : ''}`}
              onClick={handleResendCode}
              disabled={resendTimer > 0 || loading}
              style={{ marginTop: '10px' }}
            >
              {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
            </button>
          </>
        )}

        {/* Step 3: Password */}
        {step === 3 && (
          <>
            <div className="input-with-icon password-container">
              <img src={keyIcon} alt="Key Icon" className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i onClick={() => setShowPassword(prev => !prev)} role="button">
                {showPassword ? "Hide" : "Show"}
              </i>
            </div>
            
            <ul>
              {passwordErrors.map((err, idx) => (
                <li key={idx} className="invalid">✗ {err}</li>
              ))}
              {password && passwordErrors.length === 0 && (
                <li className="valid">✔ Password looks good</li>
              )}
            </ul>

            <div className="input-with-icon password-container">
              <img src={keyIcon} alt="Key Icon" className="input-icon" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <i onClick={() => setShowConfirm(prev => !prev)} role="button">
                {showConfirm ? "Hide" : "Show"}
              </i>
            </div>


            {confirmError && <p className="invalid">{confirmError}</p>}

            <button className="btn bt-primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Set Password'}
            </button>
          </>
        )}

        <p className='signup-text'>
          Go back to <a href="/" className="link-button">login</a> page
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
