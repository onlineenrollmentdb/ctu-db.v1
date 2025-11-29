import React, { useState, useMemo, useEffect } from "react";
import API from "../api/api";

const MAX_UNIT_LOAD = 28;
const MAX_WITH_OVERLOAD = 30;

const EnrollForm = ({
  selectedSubjects,
  studentId,
  semester,
  academicYear,
  onLockSubjects,
  addToast,
  settings,
}) => {
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isError, setIsError] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);

  /** Convert date to local date only */
  const toLocalDateOnly = (dateString) => {
    const d = new Date(dateString);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  /** Determine if enrollment is open */
  useEffect(() => {
    if (!settings) return;

    let startDateStr, endDateStr;
    if (semester === "1st") {
      startDateStr = settings.first_sem_enrollment_start;
      endDateStr = settings.first_sem_enrollment_end;
    } else if (semester === "2nd") {
      startDateStr = settings.second_sem_enrollment_start;
      endDateStr = settings.second_sem_enrollment_end;
    } else if (semester === "Summer") {
      startDateStr = settings.summer_start;
      endDateStr = settings.summer_end;
    }

    if (!startDateStr || !endDateStr) {
      setIsEnrollmentOpen(false);
      return;
    }

    const today = toLocalDateOnly(new Date());
    const start = toLocalDateOnly(startDateStr);
    const end = toLocalDateOnly(endDateStr);

    setIsEnrollmentOpen(today >= start && today <= end);
  }, [settings, semester]);

  /** Fetch enrollment status from backend */
  useEffect(() => {
    const fetchStatus = async () => {
      if (!studentId || !semester || !academicYear) return;

      try {
        const res = await API.get(`/enrollments/status/${studentId}`, {
          params: { semester, academic_year: academicYear },
        });

        const status = res.data?.step ?? null;
        setEnrollmentStatus(status);

        // Lock subjects if already submitted or enrolled
        if (status !== 1 && onLockSubjects) onLockSubjects(true);
        else if (onLockSubjects) onLockSubjects(false);
      } catch (err) {
        console.error("[EnrollForm] Cannot fetch enrollment status:", err);
        setEnrollmentStatus(null);
      }
    };

    fetchStatus();
  }, [studentId, semester, academicYear, onLockSubjects]);

  /** Total Units Calculation */
  const totalUnits = useMemo(
    () => selectedSubjects.reduce((sum, s) => sum + Number(s.units || s.unit || 0), 0),
    [selectedSubjects]
  );

  /** Overload Checker */
  const overloadStatus = useMemo(() => {
    if (totalUnits > MAX_WITH_OVERLOAD) return "exceeded";
    if (totalUnits > MAX_UNIT_LOAD) return "overload";
    return "normal";
  }, [totalUnits]);

  /** Enroll Handler */
  const handleEnroll = async () => {
    if (overloadStatus === "exceeded") {
      const msg = "❌ Unit load exceeds 27 units. Remove some subjects before enrolling.";
      setIsError(true);
      setMessage(msg);
      setShowPopup(true);
      addToast?.(msg, "error");
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

    try {
      const res = await API.post("/enrollments", {
        student_id: studentId,
        semester,
        academic_year: academicYear,
        subject_sections: selectedSubjects.map((s) => s.subject_section),
      });

      const responseMessage = res.data?.message || "Enrollment submitted! Await verification.";
      setMessage(responseMessage);
      addToast?.(responseMessage, "success");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);

      // Update status locally
      setEnrollmentStatus(2);
      if (onLockSubjects) onLockSubjects(true);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || "Something went wrong.";
      setIsError(true);
      setMessage(errorMsg);
      addToast?.(errorMsg, "error");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  /** Render status message */
  const renderStatusMessage = () => {
    if (enrollmentStatus === 2)
      return <span style={{ color: "orange", fontWeight: "bold" }}>
        Your enrollment has been submitted and is awaiting verification.
      </span>;
    if (enrollmentStatus === 3)
      return <span style={{ color: "green", fontWeight: "bold" }}>
        You are now enrolled. Please study well.
      </span>;
    if (enrollmentStatus === 1)
      return <span style={{ color: "blue", fontWeight: "bold" }}>
        Enrollment is open. Please select your subjects to proceed.
      </span>;
    return <span style={{ color: "gray", fontWeight: "bold" }}>
      Enrollment is not available at this time.
    </span>;
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      {/* Button / Message Area */}
      <div className="enrollment-action-bar">
        {enrollmentStatus === 1 && isEnrollmentOpen ? (
          <button
            className="btn btn-primary"
            onClick={handleEnroll}
            disabled={selectedSubjects.length === 0 || overloadStatus === "exceeded"}
          >
            Enroll Now
          </button>
        ) : (
          renderStatusMessage()
        )}
      </div>

      {/* Units Display */}
      <div className="total-units">
        <span style={{
          color: overloadStatus === "exceeded" ? "red" :
                 overloadStatus === "overload" ? "orange" : "green",
          fontWeight: 500
        }}>
          Total Units: {totalUnits}
          {overloadStatus === "overload" && " ⚠️ Overload (Needs Approval)"}
          {overloadStatus === "exceeded" && " ❌ Overload Limit Exceeded"}
        </span>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className={`popup ${isError ? "error" : "success"}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default EnrollForm;
