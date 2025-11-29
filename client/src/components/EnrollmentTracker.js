import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { connectSocket } from "../socket";
import "../css/EnrollmentTracker.css";

const EnrollmentTracker = ({ student, currentStep = 0, setCurrentStep, settings, addToast }) => {
  const navigate = useNavigate();
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [activeConnector, setActiveConnector] = useState([]);

  const reloadAfterDelay = () => {
    setTimeout(() => {
      if (!student || !settings) return;
      API.get(`/enrollments/status/${student.student_id}`, {
        params: {
          semester: settings.current_semester,
          academic_year: settings.current_academic_year,
        },
      })
      .then((res) => {
        if (setCurrentStep && res.data.status != null) {
          setCurrentStep(res.data.status);
        }
      })
      .catch((err) => console.error("Failed to fetch enrollment status:", err));
    }, 2000);
  };
  const reloadPageIn2Sec = () => {
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };


  // WebSocket + initial fetch
  useEffect(() => {
    if (!student || !settings) return;

    const fetchEnrollmentStatus = async () => {
      try {
        const statusRes = await API.get(`/enrollments/status/${student.student_id}`, {
          params: {
            semester: settings.current_semester,
            academic_year: settings.current_academic_year,
          },
        });
        if (setCurrentStep && statusRes.data.status != null) {
          setCurrentStep(statusRes.data.status);
        }
      } catch (err) {
        console.error("Failed to fetch enrollment status:", err);
      }
    };

    // WebSocket for live updates
    const socket = connectSocket(student.token);

    const updateStatus = (data) => {
      if (data.student_id === student.student_id && setCurrentStep) {
        setCurrentStep(data.status);
      }
    };

    socket.on("enrollment-status-updated", updateStatus);

    // Initial fetch
    fetchEnrollmentStatus();

    return () => {
      socket.off("enrollment-status-updated", updateStatus);
      socket.disconnect();
    };
  }, [student, settings, setCurrentStep]);

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
      addToast("Reloading Page in 3 seconds", "warning");
      addToast("Successfully skipped Requirements", "success");

      reloadAfterDelay();
      reloadPageIn2Sec();
    } catch (error) {
      console.error("Failed to skip Requirements:", error);
      addToast("Failed to skip Requirements.", "error");
      if (setCurrentStep) setCurrentStep(0);
    }
  };

  const handleEnrollmentSkip = async () => {
    if (!student) return;

    try {
      const statusRes = await API.get(`/enrollments/status/${student.student_id}`, {
        params: { semester: settings.current_semester, academic_year: settings.current_academic_year },
      });

      const { enrollment_id } = statusRes.data;
      if (!enrollment_id) {
        addToast("No enrollment record found for this student.", "error");
        return;
      }

      await API.put(`/admin/enrollment/${enrollment_id}/confirm`);
      addToast("Reloading Page in 3 seconds", "warning");
      addToast("Enrollment confirmed successfully.", "success");

      if (setCurrentStep) setCurrentStep(3);

      reloadAfterDelay();
      reloadPageIn2Sec();
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
              <button className="clearance-link" onClick={handleSkipClearance}>here</button> to skip
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
      details: (status) => {
        if (status < 2) return "Enrollment will be available after completing the requirements";
        return (
          <div>
            <span className="note">
              <i className="bi bi-exclamation-circle-fill text-warning"></i> The enrollment process will be checked by the following personnel:
            </span>
            <span>
              <i className={`bi ${status > 0 ? "bi-check-circle-fill" : "bi-circle"}`}> Faculty Approval</i><br />
              <i className={`bi ${status > 0 ? "bi-check-circle-fill" : "bi-circle"}`}> Dean Approval</i>
            </span><br />
            {status > 2 && <span>Your Enrollment Form has been confirmed!!</span>}
            {status === 2 && (
              <span className="skip-step">
                or click{" "}
                <button className="clearance-link" onClick={handleEnrollmentSkip}>here</button> to skip
              </span>
            )}
          </div>
        );
      }
    },
    {
      label: "ENROLLED",
      details: (status) => status === 3 ? "Congratulations! You are officially enrolled! 🎉" : "Finish the required steps for official enrollment"
    }
  ];

  // Animation logic
  useEffect(() => {
    setVisibleSteps([]);
    setActiveConnector([]);
    if (currentStep === 0) {
      setVisibleSteps([0]);
      return;
    }

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
        const isActiveStep = i === currentStep && visibleSteps.includes(i - 1);

        return (
          <div className="step card" key={i}>
            <div>
              <div
                className={`circle ${isVisible ? "pop-anim" : ""} ${isVisible ? "completed" : ""} ${isActiveStep ? "active" : ""}`}
                onClick={() => handleCircleClick(i)}
              >
                <img src={require(`../img/icons/${i + 1}.webp`)} alt={`Step ${i + 1}`} />

                {i === steps.length - 1 && isActiveStep && (
                  <div className="confetti-container">
                    {Array.from({ length: 40 }).map((_, index) => {
                      const randX = Math.floor(Math.random() * 80 - 40);
                      const randRot = Math.floor(Math.random() * 360);
                      const randDur = (1.5 + Math.random() * 2).toFixed(2);
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

              {i < steps.length - 1 && (
                <div className={`connector ${isConnectorDone ? "done connector-anim" : ""}`} />
              )}
            </div>

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
