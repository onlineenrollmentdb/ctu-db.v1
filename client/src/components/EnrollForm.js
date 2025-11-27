import React, { useState, useMemo, useEffect } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const MAX_UNIT_LOAD = 25;
const MAX_WITH_OVERLOAD = 27;

const EnrollForm = ({
  selectedSubjects,
  studentId,
  semester,
  academicYear,
  onLockSubjects,
  addToast,
  settings, // ⚡ cached settings from parent
}) => {
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isError, setIsError] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);
  const navigate = useNavigate();

  /** 🔹 Convert date to local date only */
  const toLocalDateOnly = (dateString) => {
    const d = new Date(dateString);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  /** 🔹 Determine if enrollment is open (with cached settings) */
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

  /** 🔹 Fetch student enrollment status */
  useEffect(() => {
    const fetchStatus = async () => {
      if (!studentId) return;

      try {
        const res = await API.get(`/enrollments/status/${studentId}`);
        const status = res.data?.step ?? null;

        setEnrollmentStatus(status);

        // Lock subjects if student has submitted already
        if (status !== 1 && onLockSubjects) onLockSubjects(true);
        else if (onLockSubjects) onLockSubjects(false);
      } catch (err) {
        console.error("[EnrollForm] Cannot fetch enrollment status:", err);
        setEnrollmentStatus(null);
      }
    };

    fetchStatus();
  }, [studentId, onLockSubjects]);

  /** 🔹 Total Units Calculation */
  const totalUnits = useMemo(
    () =>
      selectedSubjects.reduce(
        (sum, subject) =>
          sum + Number(subject.units || subject.unit || 0),
        0
      ),
    [selectedSubjects]
  );

  /** 🔹 Overload Checker */
  const overloadStatus = useMemo(() => {
    if (totalUnits > MAX_WITH_OVERLOAD) return "exceeded";
    if (totalUnits > MAX_UNIT_LOAD) return "overload";
    return "normal";
  }, [totalUnits]);

  /** 🔹 Enroll Handler */
  const handleEnroll = async () => {
    if (overloadStatus === "exceeded") {
      const msg =
        "❌ Unit load exceeds 27 units. Remove some subjects before enrolling.";
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

      let responseMessage =
        res.data?.message || "Enrollment successful! 🎓";

      if (res.data?.duplicates?.length > 0) {
        responseMessage += ` (Skipped: ${res.data.duplicates.join(", ")})`;
      }

      setMessage(responseMessage);
      addToast?.(responseMessage, "success");
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
        navigate("/home");
      }, 3000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        error.message ||
        "Something went wrong.";
      setIsError(true);
      setMessage(errorMsg);
      addToast?.(errorMsg, "error");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  /** 🔹 Status Message Renderer */
/** 🔹 Status Message Renderer */
const renderStatusMessage = () => {
  const today = toLocalDateOnly(new Date());
  let startDateStr, endDateStr;

  if (semester === "1st") {
    startDateStr = settings?.first_sem_enrollment_start;
    endDateStr = settings?.first_sem_enrollment_end;
  } else if (semester === "2nd") {
    startDateStr = settings?.second_sem_enrollment_start;
    endDateStr = settings?.second_sem_enrollment_end;
  } else if (semester === "Summer") {
    startDateStr = settings?.summer_start;
    endDateStr = settings?.summer_end;
  }

  const start = startDateStr ? toLocalDateOnly(startDateStr) : null;
  const end = endDateStr ? toLocalDateOnly(endDateStr) : null;

  // If enrollment hasn't started yet
  if (start && today < start)
    return (
      <span style={{ color: "gray", fontWeight: "bold" }}>
        Enrollment for {semester} semester has not started yet.
      </span>
    );

  // If enrollment has ended
  if (end && today > end) {
    if (enrollmentStatus === 1) {
      return (
        <span style={{ color: "red", fontWeight: "bold" }}>
          Enrollment for {semester} semester has ended.
        </span>
      );
    } else if (enrollmentStatus === 3) {
      return (
        <span style={{ color: "green", fontWeight: "bold" }}>
          You are now enrolled. Please study well.
        </span>
      );
    }
  }

  // If enrollment is ongoing
  if (isEnrollmentOpen) {
    switch (enrollmentStatus) {
      case 2:
        return (
          <span style={{ color: "orange", fontWeight: "bold" }}>
            Your enrollment has already been submitted.
          </span>
        );
      case 3:
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            You are now enrolled. Please study well.
          </span>
        );
      default:
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            Enrollment is open. Please select your subjects to proceed.
          </span>
        );
    }
  }
  // Fallback message for students who missed enrollment
  return (
    <span style={{ color: "gray", fontWeight: "bold" }}>
      Enrollment for this semester has concluded. Please contact the administration to inquire about special enrollment options.
    </span>
  );
};

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* 🔹 Button / Message Area */}
      <div className="enrollment-action-bar">
        {enrollmentStatus === 1 ? (
          <button
            className="btn btn-primary"
            onClick={handleEnroll}
            disabled={
              selectedSubjects.length === 0 ||
              overloadStatus === "exceeded" ||
              !isEnrollmentOpen
            }
            style={{ width: "100%" }}
          >
            Enroll
          </button>
        ) : (
          renderStatusMessage()
        )}
      </div>

      {/* 🔹 Units Display */}
      <div className="total-units">
        <span
          style={{
            color:
              overloadStatus === "exceeded"
                ? "red"
                : overloadStatus === "overload"
                ? "orange"
                : "green",
            fontWeight: 500,
          }}
        >
          Total Units: {totalUnits}
          {overloadStatus === "overload" &&
            " ⚠️ Overload (Needs Approval)"}
          {overloadStatus === "exceeded" &&
            " ❌ Overload Limit Exceeded"}
        </span>
      </div>

      {/* 🔹 Popup */}
      {showPopup && (
        <div className={`popup ${isError ? "error" : "success"}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default EnrollForm;
