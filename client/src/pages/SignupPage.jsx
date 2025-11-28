import React, { useState } from 'react';
import API from '../api/api';
import ctuLogo from '../img/ctu_logo.webp';
import { useNavigate } from 'react-router-dom';
import "../css/LoginPage.css";

const SignupPage = () => {
  const [step, setStep] = useState(1); // 1=ID, 2=Code
  const [student_id, setStudentId] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // STEP 1: Verify Student ID
  const handleCheckStudent = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await API.post('/auth/check-student', { student_id });
      setSuccess(res.data.message);
      setStep(2); // move to code verification step
    } catch (err) {
      if (err.response?.data?.error) setError(err.response.data.error);
      else setError('Failed to check student ID.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify Code and Redirect to Reset Password
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!/^\d{6}$/.test(code)) {
        setError('Please enter a valid 6-digit code.');
        setLoading(false);
        return;
      }

      // Verify code with backend
      const res = await API.post('/auth/verify-code', { student_id, code });

      // Expect backend to return a token for resetting password
      const { token } = res.data;

      setSuccess('Code verified. Redirecting to reset password...');
      setTimeout(() => {
        navigate(`/reset-password/${token}`);
      }, 1000);

    } catch (err) {
      if (err.response?.data?.error) setError(err.response.data.error);
      else setError('Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="t-body">
      <form
        className="t-container"
        onSubmit={step === 1 ? handleCheckStudent : handleVerifyCode}
      >
        <img src={ctuLogo} alt="CTU Logo" className="ctu-logo"/>
        <h3>
          {step === 1 ? 'Verify Student ID' : 'Enter Verification Code'}
        </h3>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        {/* Step 1: Student ID */}
        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Enter Student ID"
              value={student_id}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
            <button className="btn t-btn" type="submit" disabled={loading}>
              {loading ? 'Checking...' : 'Verify'}
            </button>
          </>
        )}

        {/* Step 2: Verification Code */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter 6-digit Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <button className="btn t-btn" type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </>
        )}

        <p className='signup-text'>
          Already have an account? <a href="/">Login here</a>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
