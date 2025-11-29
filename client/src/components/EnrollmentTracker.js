import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectSocket } from "../socket";
import API from "../api/api";
import "../css/EnrollmentTracker.css";

const EnrollmentTracker = ({ student, currentStep = 0, setCurrentStep, settings, addToast }) => {
  const navigate = useNavigate();
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [activeConnector, setActiveConnector] = useState([]);

  const handleSkipClearance = async () => {
    if (!student) return;
    if (setCurrentStep) setCurrentStep(1);

    try {
      await API.put("/clearance/update", {
        student_id: student.student_id,
        is_cleared: true,
        academic_year: settings.current_academic_year,
        semester: settings.current_semester,
      });
      addToast("Successfully skipped Requirements", "success");
    } catch (error) {
      console.error("Failed to skip Requirements:", error);
      addToast("Failed to skip Requirements.", "error");
      if (setCurrentStep) setCurrentStep(0);
    }
  };
  // Skip / Confirm Enrollment (Processing step)
  const handleEnrollmentSkip = async () => {
    if (!student) return;

    try {
      // 1️⃣ Fetch enrollment status to get enrollment_id
      const statusRes = await API.get(`/enrollments/status/${student.student_id}`, {
        params: {
          semester: settings.current_semester,
          academic_year: settings.current_academic_year,
        },
      });

      const { enrollment_id} = statusRes.data;

      if (!enrollment_id) {
        addToast("No enrollment record found for this student.", "error");
        return;
      }

      // 2️⃣ Confirm enrollment using the enrollment_id
      await API.put(`/admin/enrollment/${enrollment_id}/confirm`);
      addToast("Enrollment confirmed successfully.", "success");

      // 3️⃣ Move step forward to Enrolled (step 3)
      if (setCurrentStep) setCurrentStep(3);
    } catch (error) {
      console.error("Failed to confirm enrollment:", error.response?.data || error);
      addToast("Failed to confirm enrollment.", "error");
    }
  };


  const steps = [
    {
      label: "Requirements",
      details: (status) => (
        <div>
          <span>
            Requirements {status > 0 ? "have been submitted successfully:" : "to submit:"}<br />
            <i className={`bi ${status > 0 ? "bi-check-circle-fill" : "bi-circle"}`}> Medical Form</i><br />
            <i className={`bi ${status > 0 ? "bi-check-circle-fill" : "bi-circle"}`}> Clearance Form</i>
          </span>
          {!status && (
            <span className="skip-step">
              or click{" "}
              <button className="clearance-link" onClick={handleSkipClearance}>here</button> to skip (pilot testing)
            </span>
          )}
        </div>
      )
    },
    {
      label: "Enrollment",
      details: (status) => {
        if (status === 0) return "Enrollment will be available after completing the requirements";
        if (status > 1) return "You have completed the enrollment form";
        return (
          <div>
            <span className="note">
              <i className="bi bi-exclamation-circle-fill text-warning"></i> Please update your profile if you haven't yet.
            </span><br />
            <span>
              Enrollment is now available. Click{" "}
              <button className="clearance-link" onClick={() => navigate("/enroll")}>here</button> to enroll.
            </span>
          </div>
        );
      }
    },
    {
      label: "Processing",
      details: (status) =>{
        if (status < 2) return "Enrollment will be available after completing the requirements";
        return(
          <div>
            <span className="note">
              <i className="bi bi-exclamation-circle-fill text-warning"></i> The enrollment process well be checked by the following personnel:
            </span>
            <span>
            <i className={`bi ${status > 0 ? "bi-check-circle-fill" : "bi-circle"}`}> Faculty Approval</i><br />
            <i className={`bi ${status > 0 ? "bi-check-circle-fill" : "bi-circle"}`}> Dean Approval</i></span><br />
            {status > 2 && (
              <span>Your Enrolment Form has been confirmed!!</span>
            )}
            {!status && (
            <span className="skip-step">
              or click{" "}
              <button className="clearance-link" onClick={handleEnrollmentSkip}>here</button> to skip (pilot testing)
            </span>
            )}
          </div>
          );
      }
    },
    {
      label: "ENROLLED",
      details: (status) =>
        status === 3 ? "Congratulation you are officially enrolled! 🎉" : "Finish the required steps for official enrollment"
    }
  ];

  // Socket listener
  useEffect(() => {
    if (!student) return;
    const socket = connectSocket(student.token);

    socket.on("enrollment-status-updated", (data) => {
      if (data.student_id === student.student_id) {
        if (setCurrentStep) setCurrentStep(data.status);
      }
    });

    return () => socket.disconnect();
  }, [student, setCurrentStep]);

  // Chain animation logic
  useEffect(() => {
    setVisibleSteps([]);
    setActiveConnector([]);

    if (currentStep === 0) return;

    const popDuration = 450;
    const connectorDuration = 700;

    const animateStep = (step) => {
      if (step >= currentStep) return;

      setVisibleSteps(prev => [...prev, step]);

      if (step < steps.length - 1) {
        setTimeout(() => {
          setActiveConnector(prev => [...prev, step]);
          setTimeout(() => animateStep(step + 1), connectorDuration);
        }, popDuration);
      }
    };

    animateStep(0);
  }, [currentStep, steps.length]);


  const handleCircleClick = (i) => {
    if (i === 1) navigate("/enroll");
  };

return (
  <div className="tracker-container">
    {steps.map((step, i) => {
      const isVisible = visibleSteps.includes(i);
      const isConnectorDone = activeConnector.includes(i);

      // Only mark as active if this is the currentStep AND its animation finished
      const isActiveStep = i === currentStep && visibleSteps.includes(i - 1);
      return (
        <div className="step card" key={i}>
          <div>
            {/* Circle */}
            <div
              className={`circle ${isVisible ? "pop-anim" : ""} ${isVisible ? "completed" : ""} ${isActiveStep ? "active" : ""}`}
              onClick={() => handleCircleClick(i)}
            >
              <img src={require(`../img/icons/${i + 1}.webp`)} alt={`Step ${i + 1}`} />

              {/* ✅ Confetti for the last step */}
              {i === steps.length - 1 && isActiveStep && (
                <div className="confetti-container">
                  {Array.from({ length: 40 }).map((_, index) => {
                    const randX = Math.floor(Math.random() * 80 - 40); // -40px to +40px
                    const randRot = Math.floor(Math.random() * 360);   // 0 to 360deg
                    const randDur = (1.5 + Math.random() * 2).toFixed(2); // 1.5s to 3.5s
                    return (
                      <span
                        key={index}
                        className="confetti"
                        style={{
                          '--randX': `${randX}px`,
                          '--randRot': `${randRot}deg`,
                          animationDuration: `${randDur}s`,
                        }}
                      ></span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Connector */}
            {i < steps.length - 1 && (
              <div className={`connector ${isConnectorDone ? "done connector-anim" : ""}`} />
            )}
          </div>

          {/* Step Text */}
          <div className={`step-text ${isVisible ? "fade-in" : "hidden"} ${isActiveStep ? "active-text" : ""}`}>
            <span className="step-label">{step.label}</span>
            <div className="dividerStyle"></div>
            <p className="details">{step.details(currentStep)}</p>
          </div>
        </div>
      );
    })}
  </div>
);






};

export default EnrollmentTracker;
