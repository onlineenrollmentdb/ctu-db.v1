// src/pages/EnrollmentPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Info } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import API from "../api/api";
import EnrollForm from "../components/EnrollForm";
import "../css/EnrollmentPage.css";

// Check if profile is complete
const isProfileComplete = (student) => {
  if (!student) return false;
  const requiredFields = [
    "last_name",
    "first_name",
    "middle_name",
    "permanent_address",
    "contact_number",
    "congressional_district",
    "region",
    "email",
    "gender",
    "birth_date",
    "birthplace",
    "citizenship",
    "religion",
    "civil_status",
  ];
  return requiredFields.every(
    (field) => student[field] && student[field].toString().trim() !== ""
  );
};

const EnrollmentPage = () => {
  const { user: student } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [semester, setSemester] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [settings, setSettings] = useState(null);
  const [allSubjects, setAllSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [passedSubjects, setPassedSubjects] = useState([]);
  const [failedSubjects, setFailedSubjects] = useState([]);
  const [enrolledSubjects, setEnrolledSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openPopup, setOpenPopup] = useState(null);
  const profileToastRef = useRef(false);

  // Redirect if no student
  useEffect(() => {
    if (!student) navigate("/");
  }, [student, navigate]);

  // Fetch settings
  useEffect(() => {
    API.get("/settings")
      .then((res) => {
        setSemester(res.data.current_semester);
        setAcademicYear(res.data.current_academic_year);
        setSettings(res.data);
      })
      .catch(() => {
        setSemester("Null");
        setAcademicYear("Null");
      });
  }, []);

  // Fetch subjects, grades, and enrollment
  useEffect(() => {
    if (!student || !semester || !academicYear) return;

    setLoading(true);

    Promise.all([
      API.get("/subjects"),
      API.get(`/enrollments/grades/${student.student_id}`),
      API.get(
        `/enrollments/status/${student.student_id}?semester=${semester}&academic_year=${academicYear}`
      ),
    ])
      .then(([subjectsRes, gradesRes, statusRes]) => {
        const subjects = subjectsRes.data;
        const grades = gradesRes.data;

        const passed = grades
          .filter((g) => g.status?.toLowerCase() === "passed")
          .map((g) => g.subject_section);

        const failed = grades
          .filter((g) => g.status?.toLowerCase() === "failed")
          .map((g) => ({
            subject_section: g.subject_section,
            academic_year: g.academic_year,
          }));

        setPassedSubjects(passed);
        setFailedSubjects(failed);

        const failCountsMap = {};
        const firstTakenYearMap = {};
        grades.forEach((g) => {
          if (g.status?.toLowerCase() === "failed") {
            const code = g.subject_section;
            const year = parseInt(g.academic_year.split("-")[0]);
            failCountsMap[code] = (failCountsMap[code] || 0) + 1;
            if (!firstTakenYearMap[code] || year < firstTakenYearMap[code]) {
              firstTakenYearMap[code] = year;
            }
          }
        });

        setAllSubjects(subjects);

        // Enrolled subjects
        if (
          statusRes.data?.step &&
          [2, 3, 4].includes(statusRes.data.step) &&
          statusRes.data.enrollment_id
        ) {
          API.get(`/enrollments/${student.student_id}/subjects`)
            .then((res2) => setEnrolledSubjects(res2.data))
            .catch(console.error);
        }

        // Show toast if profile incomplete
        if (!profileToastRef.current && !isProfileComplete(student)) {
          addToast("Please complete your profile before enrolling ⚠️", "warning");
          profileToastRef.current = true;
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [student, semester, academicYear, addToast]);

  // Guarded student properties
  const isIrregular = student ? student.student_status?.toLowerCase() === "irregular" : false;
  const isEnrollmentLocked = student ? [2, 3, 4].includes(student.enrollment_status) : false;

  // Retake logic
  const canRetake = (subjectCode, firstYear) => {
    if (!firstYear) return true;
    const currentYear = parseInt(academicYear.split("-")[0]);
    return currentYear - firstYear <= 1;
  };

  const checkYearStanding = () => {
    if (!student) return true;
    if (student.year_level === 2 && semester === "2nd") {
      const firstSemSubjects = allSubjects.filter(
        (s) => s.year_level === 2 && s.semester === "1st"
      );
      return firstSemSubjects.every((s) => passedSubjects.includes(s.subject_section));
    }
    return true;
  };

  const getEligibility = (subject) => {
    if (!student) return { status: "eligible" };

    const isAlreadyEnrolled = enrolledSubjects.some(
      (es) => es.subject_section === subject.subject_section
    );
    if (isAlreadyEnrolled) return { status: "enrolled" };

    if (passedSubjects.includes(subject.subject_section)) return { status: "passed" };

    const failedSubject = failedSubjects.find(
      (f) => f.subject_section === subject.subject_section
    );
    if (failedSubject) {
      const firstYear = parseInt(failedSubject.academic_year.split("-")[0]);
      if (canRetake(subject.subject_section, firstYear)) return { status: "retake" };
      return { status: "blocked", reason: "Cannot retake. Subject failed >1 year ago" };
    }

    if (subject.prerequisites?.length > 0) {
      const passedCodes = allSubjects
        .filter((s) => passedSubjects.includes(s.subject_section))
        .map((s) => s.subject_code);
      const unmet = subject.prerequisites.filter((pr) => !passedCodes.includes(pr.code));
      if (unmet.length > 0)
        return {
          status: "blocked",
          reason: `You need to pass the following subjects: ${unmet
            .map((pr) => pr.code)
            .join(", ")}`,
        };
    }

    if (!checkYearStanding())
      return {
        status: "blocked",
        reason: "Year Standing: Must complete previous semester subjects first",
      };

    return { status: "eligible" };
  };

  const handleCheckboxChange = (subject, checked) => {
    setSelectedSubjects((prev) =>
      checked
        ? [...prev, subject]
        : prev.filter((s) => s.subject_section !== subject.subject_section)
    );
  };

  const filteredSubjects = student
    ? isEnrollmentLocked
      ? enrolledSubjects.map((es) => ({ ...es, is_enrolled: 1 }))
      : allSubjects.filter((subj) => {
          if (!subj) return false;
          if (isIrregular) return subj.semester === semester;
          return subj.year_level === student.year_level && subj.semester === semester;
        })
    : [];

  const statusMessages = {
    2: "Your enrollment has already been submitted.",
    3: "Enrollment in process.",
    4: "You are now enrolled.",
  };

  // Return early if no student
  if (!student) return <p>Redirecting...</p>;

  return (
    <div className="enrollment-grid">
      {student.enrollment_status && statusMessages[student.enrollment_status] && (
        <div className="enrollment-status-banner">
          <p>{statusMessages[student.enrollment_status]}</p>
        </div>
      )}

      <div className="enrollment-subjects">
        <div className="modern-table-wrapper">
          <h4>SUBJECT ENROLLMENT</h4>

          {loading ? (
            <div className="modern-table">Loading subjects...</div>
          ) : (
            <div className="modern-table">
              <table>
                <thead>
                  <tr>
                    {!isEnrollmentLocked && isIrregular && <th>Select</th>}
                    <th>Code</th>
                    <th>Description</th>
                    <th>Units</th>
                    {isEnrollmentLocked && (
                      <>
                        <th>Year</th>
                        <th>Semester</th>
                      </>
                    )}
                    {isIrregular && <th>Status</th>}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(
                    filteredSubjects.reduce((groups, subj) => {
                      const key = `Year ${subj.year_level} - ${subj.semester} Semester`;
                      if (!groups[key]) groups[key] = [];
                      groups[key].push(subj);
                      return groups;
                    }, {})
                  ).map(([group, records], idx) => {
                    const sortedRecords = records.sort((a, b) =>
                      (a.subject_code || "").localeCompare(b.subject_code || "")
                    );

                    return (
                      <React.Fragment key={group}>
                        {idx > 0 && (
                          <tr>
                            <td
                              colSpan={isEnrollmentLocked ? 5 : isIrregular ? 5 : 3}
                              className="semester-divider"
                            />
                          </tr>
                        )}

                        <tr>
                          <td
                            colSpan={isEnrollmentLocked ? 5 : isIrregular ? 5 : 3}
                            className="group-cell"
                          >
                            {group}
                          </td>
                        </tr>

                        {sortedRecords.map((s) => {
                          const eligibility = isIrregular ? getEligibility(s) : null;
                          const isAlreadyEnrolled =
                            enrolledSubjects.some(
                              (es) => es.subject_section === s.subject_section
                            ) || s.is_enrolled === 1;

                          return (
                            <tr
                              key={s.subject_section}
                              className={isAlreadyEnrolled ? "enrolled-row" : ""}
                              style={{
                                backgroundColor: isAlreadyEnrolled ? "#d4f5d4" : "transparent",
                              }}
                            >
                              {!isEnrollmentLocked && isIrregular && (
                                <td className="checkbox">
                                  {eligibility.status === "blocked" ? (
                                    <>
                                      <Info
                                        size={18}
                                        color="#f39c12"
                                        onClick={() =>
                                          setOpenPopup(
                                            openPopup === s.subject_section
                                              ? null
                                              : s.subject_section
                                          )
                                        }
                                      />
                                      {openPopup === s.subject_section && (
                                        <div className="info-popup">
                                          <div className="info-popup-title">
                                            Enrollment Blocked
                                          </div>
                                          <div className="info-popup-body">
                                            {eligibility.reason}
                                          </div>
                                          <button
                                            className="btn close-btn"
                                            onClick={() => setOpenPopup(null)}
                                          >
                                            Close
                                          </button>
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <input
                                      type="checkbox"
                                      disabled={
                                        isAlreadyEnrolled || eligibility.status === "passed"
                                      }
                                      checked={
                                        isAlreadyEnrolled ||
                                        selectedSubjects.some(
                                          (sub) => sub.subject_section === s.subject_section
                                        )
                                      }
                                      onChange={(e) =>
                                        handleCheckboxChange(s, e.target.checked)
                                      }
                                    />
                                  )}
                                </td>
                              )}

                              <td>{s.subject_code}</td>
                              <td>{s.subject_desc || "—"}</td>
                              <td style={{ textAlign: "center" }}>{s.units}</td>

                              {isEnrollmentLocked && (
                                <>
                                  <td>{s.year_level}</td>
                                  <td>{s.semester}</td>
                                </>
                              )}

                              {isIrregular && (
                                <td
                                  style={{
                                    textAlign: "center",
                                    fontWeight: 600,
                                    color: isAlreadyEnrolled
                                      ? "blue"
                                      : eligibility.status === "passed"
                                      ? "green"
                                      : eligibility.status === "retake"
                                      ? "red"
                                      : "#333",
                                  }}
                                >
                                  {isAlreadyEnrolled
                                    ? "ENROLLED"
                                    : eligibility.status.toUpperCase()}
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {isProfileComplete(student) ? (
            <div className="enrollment-form">
              <EnrollForm
                selectedSubjects={
                  isIrregular
                    ? selectedSubjects
                    : allSubjects.filter(
                        (s) =>
                          (s.year_level === student.year_level && s.semester === semester) ||
                          isEnrollmentLocked
                      )
                }
                studentId={student.student_id}
                semester={semester}
                academicYear={academicYear}
                disabled={isEnrollmentLocked}
                addToast={addToast}
                settings={settings}
              />
            </div>
          ) : (
            <div className="enrollment-form">
              <p style={{ color: "red", fontWeight: "bold" }}>
                Complete your profile to enable enrollment.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default EnrollmentPage;
