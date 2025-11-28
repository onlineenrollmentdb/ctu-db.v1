import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { connectSocket } from "../socket";
import EnrollmentTracker from "../components/EnrollmentTracker";
import "../css/HomePage.css";
import "../css/EnrollmentTracker.css";

const HomePage = () => {
  const { user: student, loading } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!student) navigate("/");
  }, [student, navigate]);

  // Fetch system settings once
  useEffect(() => {
    API.get("/settings")
      .then((res) => setSettings(res.data))
      .catch(() => setSettings(null));
  }, []);

  // Fetch enrollment status based on current semester & academic year
  useEffect(() => {
    if (!student || !settings) return;
    setIsLoading(true);

    API.get(`/enrollments/status/${student.student_id}`, {
      params: {
        semester: settings.current_semester,
        academic_year: settings.current_academic_year,
      },
    })
      .then((res) => setCurrentStep(res.data?.step || 0))
      .catch(() => setCurrentStep(0))
      .finally(() => setIsLoading(false));
  }, [student, settings]);

  // Socket listener for live updates
  useEffect(() => {
    if (!student) return;
    const socket = connectSocket(student.token);

    const updateStatus = (data) => {
      if (data.student_id === student.student_id) {
        setCurrentStep(data.status);
      }
    };

    socket.on("enrollment-status-updated", updateStatus);
    return () => socket.off("enrollment-status-updated", updateStatus);
  }, [student]);

  if (!student || loading || !settings) return null;


  const handleStepClick = (i) => {
    if (i === 1 && student.enrollment_status >= 1) navigate("/enroll");
    if (i === 2 && student.enrollment_status >= 2)
      window.open("https://docs.google.com/forms/your-form-link", "_blank");
  };

  return (
    <div className="homepage hs">
      <div className="background-blur"></div>
      <div className="homepage-content">
        <h1 className="welcome-text">
          Welcome <span>{student.first_name} {student.last_name}</span>
        </h1>

        <div className="status-card">
          <h4 className="status-text">ENROLLMENT STATUS</h4>

          <EnrollmentTracker
            student={student}
            currentStep={currentStep}
            enrollmentStatus={student.enrollment_status}
            onStepClick={handleStepClick}
          />

          {isLoading && (
            <small className="text-muted">Loading enrollment status...</small>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
