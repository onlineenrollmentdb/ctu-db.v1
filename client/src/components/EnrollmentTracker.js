// src/components/EnrollmentTracker.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {connectSocket} from "../socket";
import "../css/EnrollmentTracker.css";

const EnrollmentTracker = ({
  student,
  currentStep = 0,
  onStepClick,
  setCurrentStep, // ✅ pass state setter from parent
}) => {
  const navigate = useNavigate();
  const [activeBox, setActiveBox] = useState(null); // track which step box is open

  // Step definitions with professional details
  const steps = [
    {
      label: "Clearance",
      details: (status) =>
        status > 0
          ? "Student clearance has been verified ✅"
          : "Submit all clearance requirements (ID, documents, fees, etc.)",
    },
    {
      label: "Enrollment",
      details: (status) =>
        status > 1
          ? "You have completed the enrollment form ✅"
          : "Fill out and submit the enrollment form",
    },
    {
      label: "Processing",
      details: (status) =>
        status > 2
          ? "Registrar has validated your documents ✅"
          : "Registrar is reviewing and validating your submitted forms",
    },
    {
      label: "Enrolled",
      details: (status) =>
        status === 3
          ? "You are officially enrolled! 🎉 Welcome!"
          : "Pending final confirmation from administration",
    },
  ];

  // 🔹 Listen to socket updates
  useEffect(() => {
    if (!student) return;
    const socket = connectSocket(student.token);

    const handleStatusUpdate = (data) => {
      if (data.student_id === student.student_id) {
        console.log("📢 Enrollment status updated via socket:", data);
        if (setCurrentStep) setCurrentStep(data.status); // 🔹 sync step
      }
    };

    socket.on("enrollment-status-updated", handleStatusUpdate);

    return () => {
      socket.off("enrollment-status-updated", handleStatusUpdate);
    };
  }, [student, setCurrentStep]);

  const handleCircleClick = async (i, step) => {
    // Toggle dropdown box
    setActiveBox(activeBox === i ? null : i);

    // Only allow actions for the current step
    if (i !== currentStep) return;

    // Step-specific actions
    if (i === 1) {
      navigate("/enroll");
    }
  };

  return (
    <div className="horizontal-tracker" role="list" aria-label="Enrollment steps">
      {steps.map((step, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        const isLast = i === steps.length - 1;

        // 🔹 Determine circle class
        let circleClass = "";
        if (isLast && currentStep === 3) {
          circleClass = "completed"; // fully green
        } else if (isCompleted) {
          circleClass = "completed"; // completed steps before current
        } else if (isCurrent) {
          circleClass = "active"; // active step
        }

        return (
          <div
            className="step"
            key={i}
            role="listitem"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}
          >
            {/* Circle Icon */}
            <div
              className={`circle ${circleClass} clickable`}
              onClick={() => handleCircleClick(i, step)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={require(`../img/icons/${i + 1}.webp`)}
                alt={`Step ${i + 1}`}
              />
            </div>

            {/* Label under circle */}
            <span className="step-label">{step.label}</span>

            {/* Dropdown Box */}
            <div className={`step-dropdown ${activeBox === i ? "open" : ""}`}>
              <p className="details">{step.details(currentStep)}</p>
            </div>

            {/* Connector */}
            {!isLast && <div className={`connector ${isCompleted ? "done" : ""}`} />}
          </div>
        );
      })}
    </div>
  );
};

export default EnrollmentTracker;
