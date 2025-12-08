import React, { useState, useEffect } from "react";
import AdminHeaderControls from "../components/AdminHeaderControls";
import {jsPDF} from "jspdf";
import autoTable from "jspdf-autotable";
import API from "../../api/api";
import { useToast } from "../../context/ToastContext";
import defaultUser from "../../img/default_user.webp";
import "../css/enrollment.css";
import logo from "../../img/ctu_logo.png";
import bpLogo from "../../img/bp_logo.png";


export default function EnrollmentTab({
  settings,
  filterYear,
  setYearFilter,
  programs,
  departments,
  students,
  setStudents
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [programFilter, setProgramFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSubjects, setStudentSubjects] = useState([]);
  const [studentDetailsCache, setStudentDetailsCache] = useState({});
  const [activeTab, setActiveTab] = useState("pending");

  const studentsPerPage = 20;
  const { addToast } = useToast();

  const serverURL = process.env.REACT_APP_SOCKET;


const handleExportPDF = async () => {
  if (activeTab !== "enrolled") {
    addToast("You can only export students from the Enrolled tab ❌", "error");
    return;
  }

  let exportStudents = [];

  // 🔹 Use ONLY what is currently displayed in the table
  const filteredBase = currentStudents;

  // 🔹 Determine Program and Department Names
  let selectedProgram = null;
  let selectedDepartment = null;

  if (programFilter) {
    selectedProgram = programs.find(p => p.program_id === Number(programFilter));
    if (selectedProgram) {
      selectedDepartment = departments.find(d => d.department_id === selectedProgram.department_id);
    }
  }

  // ---------- STATUS FILTERING ----------
  if (statusFilter === "Regular") {
    const regularList = filteredBase.filter(s => s.student_status === "Regular");
    if (regularList.length === 0) {
      addToast("No Regular students to export ❌", "error");
      return;
    }
    exportStudents = regularList;
  }
  else if (statusFilter === "Irregular") {
    const irregularList = filteredBase.filter(s => s.student_status === "Irregular");
    if (irregularList.length === 0) {
      addToast("No Irregular students to export ❌", "error");
      return;
    }
    exportStudents = irregularList;
  }
  else {
    if (filteredBase.length === 0) {
      addToast("No enrolled students to export ❌", "error");
      return;
    }
    exportStudents = filteredBase;
  }

  // ---------- FETCH SUBJECTS ----------
  try {
    await Promise.all(
      exportStudents.map((s) =>
        API.get(`admin/students/${s.student_id}/subjects`, {
          params: { academic_year: s.academic_year, semester: s.semester },
        })
          .then((res) => (s.subjects = res.data.subjects || []))
          .catch(() => (s.subjects = []))
      )
    );
  } catch (err) {
    console.error("Error fetching subjects for export:", err);
  }

  // 🧾 START PDF
  const doc = new jsPDF("p", "mm", "a4");

  // 🔹 Helper to load images safely
  const getBase64Image = async (imgPath) => {
    try {
      const res = await fetch(imgPath);
      const blob = await res.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.warn("Failed to load image:", imgPath, err);
      return null;
    }
  };

  const ctuLogoBase64 = await getBase64Image(logo);
  const bpLogoBase64 = await getBase64Image(bpLogo);

  if (ctuLogoBase64) doc.addImage(ctuLogoBase64, "PNG", 10, 10, 25, 25);
  if (bpLogoBase64) doc.addImage(bpLogoBase64, "PNG", 170, 10, 25, 25);

  // ---------- HEADER ----------
  doc.setFontSize(10);
  doc.text("Republic of the Philippines", 105, 12, { align: "center" });
  doc.text("CEBU TECHNOLOGICAL UNIVERSITY", 105, 16, { align: "center" });
  doc.text("DAANBANTAYAN CAMPUS", 105, 20, { align: "center" });
  doc.text("Agujo, Daanbantayan, Cebu", 105, 24, { align: "center" });
  doc.text("Website: http://www.ctu.edu.ph E-mail: info-daanbantayan@ctu.edu.ph", 105, 28, { align: "center" });
  doc.text("Phone: +6332 437 8526 loc. 102/316 1905", 105, 32, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");

  doc.text((selectedDepartment?.department_name || "ALL DEPARTMENTS").toUpperCase(),105,40,{ align: "center" });
  doc.text((selectedProgram?.program_name || "ALL PROGRAMS").toUpperCase(),105,44,{ align: "center" });

  const reportY = 52;
  doc.setFontSize(10);
  doc.text(`Students Status: ${statusFilter || "All"}`, 14, reportY);
  doc.text(`A.Y. ${settings?.current_academic_year}`, 105, reportY, { align: "center" });
  doc.text(`Semester: ${settings?.current_semester}`, 200 - 14, reportY, { align: "right" });

  // ---------- TABLE ----------
  let tableColumn = [];
  let tableRows = [];

  if (statusFilter === "Irregular") {
    tableColumn = ["ID","Fullname","Year","Section","Program","S1","S2","S3","S4","S5","S6","S7","S8","S9","S10"];
    tableRows = exportStudents.map((s) => {
      const subjects = (s.subjects || []).map(sub => sub.subject_code || "-");
      const padded = [...subjects, ...Array(10 - subjects.length).fill("-")].slice(0, 10);
      return [
        s.student_id,
        `${s.last_name}, ${s.first_name} ${s.middle_name || ""}`,
        s.year_level,
        s.section || "-",
        s.program_code || "-",
        ...padded
      ];
    });
  } else {
    tableColumn = ["Student ID", "Fullname", "Year", "Section", "Program"];
    tableRows = exportStudents.map((s) => [
      s.student_id,
      `${s.last_name}, ${s.first_name} ${s.middle_name || ""}`,
      s.year_level,
      s.section || "-",
      s.program_code || "-",
    ]);
  }

  autoTable(doc, {
    startY: 55,
    head: [tableColumn],
    body: tableRows,
    styles: { fontSize: statusFilter === "Irregular" ? 7 : 9 },
    headStyles: { fillColor: [22, 160, 133] },
  });

  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  doc.save(`${today}_EnrolledStudents.pdf`);

  addToast("PDF Export successful ✅", "success");
};




  // 🔹 View details modal + fetch subjects

  const handleViewDetails = async (student) => {
    if (studentDetailsCache[student.student_id]) {
      setSelectedStudent(studentDetailsCache[student.student_id]);
      return;
    }

    try {
      const res = await API.get(`/students/${student.student_id}`);
      setStudentDetailsCache(prev => ({ ...prev, [student.student_id]: res.data }));
      setSelectedStudent(res.data);
    } catch (err) {
      console.error("Failed to fetch student details:", err);
    }
  };


  // 🔹 Revoke or Confirm Enrollment
  const handleEnrollmentAction = async (action) => {
    if (!selectedStudent) return;

    try {
      await API.put(`admin/enrollment/${selectedStudent.enrollment_id}/${action}`);

      addToast(`${action === "revoke" ? "Revoked" : "Confirmed"} enrollment successfully ✅`, "success");

      // Update local student status if confirmed/revoked
      setStudents((prev) =>
        prev.map((s) =>
          s.student_id === selectedStudent.student_id
            ? { ...s, student_status: action === "revoke" ? "Irregular" : "Regular" }
            : s
        )
      );

      setSelectedStudent((prev) => ({
        ...prev,
        student_status: action === "revoke" ? "Irregular" : "Regular",
      }));
    } catch (err) {
      console.error("Error updating enrollment:", err);
      addToast("Failed to update enrollment ❌", "error");
    }
  };

  // Close modal
  const handleClose = () => {
    setSelectedStudent(null);
    setStudentSubjects([]);
  };

  const handleCloseOutside = (e) => {
    if (e.target.classList.contains("modal-overlay")) handleClose();
  };

  // Stats
  const totalEnrolled = students.filter(s => s.enrollment_status === 3).length;
  const totalPending = students.filter(s => s.enrollment_status === 2).length;
  const regularStudents = students.filter((s) => s.student_status === "Regular" && s.enrollment_status === 3).length;
  const irregularStudents = students.filter((s) => s.student_status === "Irregular" && s.enrollment_status === 3).length;

  // Filters
  const filteredStudents = students.filter((s) => {
    // 🔹 Tab filter (Pending / Enrolled)
    if (activeTab === "pending" && s.enrollment_status !== 2) return false;
    if (activeTab === "enrolled" && s.enrollment_status !== 3) return false;

    // 🔹 Status filter (Regular / Irregular) - only applies within the active tab
    if (statusFilter && s.student_status !== statusFilter) return false;

    // 🔹 Search by ID or full name
    const fullName = `${s.last_name} ${s.first_name} ${s.middle_name || ""}`.toLowerCase();
    const matchesSearch =
      s.student_id.toString().includes(searchQuery.toLowerCase()) ||
      fullName.includes(searchQuery.toLowerCase());

    // 🔹 Filter by program
    const matchesProgram = !programFilter || s.program_id === Number(programFilter);

    // 🔹 Filter by year
    const matchesYear = !filterYear || s.year_level === Number(filterYear);

    return matchesSearch && matchesProgram && matchesYear;
  });



  // Pagination
  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterYear, programFilter, statusFilter]);

  return (
    <>
    <div className="enrollment-tab" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Header Controls */}
      <AdminHeaderControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        programs={programs}
        programFilter={programFilter}
        setProgramFilter={setProgramFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        filterYear={filterYear}
        setYearFilter={setYearFilter}
        settings={settings}
        tab="enrollment"
      />

      <div className="enrollment-grid">
        {/* Enrollment List */}
        <div className="dashboard-section">
          <div className="table-header">
            <h3>Enrollment List</h3>
            <div className="enroll-tabs">
              <button
                className={`btn-pending ${activeTab === "pending" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("pending")}
              >
                Pending
              </button>

              <button
                className={`btn-enrolled ${activeTab === "enrolled" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("enrolled")}
              >
                Enrolled
              </button>
            </div>
          </div>
            {loading ? (
              <p>Loading enrolled students...</p>
            ) : (
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Full Name</th>
                    <th>Year</th>
                    <th>Section</th>
                    <th>Program</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.length > 0 ? (
                    currentStudents.map((s) => (
                      <tr key={s.student_id}>
                        <td>{s.student_id}</td>
                        <td>{s.last_name}, {s.first_name} {s.middle_name || ""}</td>
                        <td>{s.year_level}</td>
                        <td>{s.section || "-"}</td>
                        <td>{s.program_code || "-"}</td>
                        <td>
                          <button className="btn btn-primary" onClick={() => handleViewDetails(s)}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "12px" }}>
                        No enrolled students found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem", gap: "8px" }}>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                  Prev
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                  Next
                </button>
              </div>
            )}

            {/* Single Export Button */}
            {activeTab === "enrolled" && (
              <div style={{ textAlign: "right", marginTop: "1rem" }}>
                <button onClick={handleExportPDF} className="btn-export">
                  Export to PDF
                </button>
              </div>
            )}

        </div>

        {/* Stats Cards */}
        <div className="dashboard-cards" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            className="dashboard-card"
            onClick={() => setActiveTab("enrolled") && statusFilter === ""}
          >
            <h3>Total Enrolled</h3><p>{totalEnrolled}</p>
          </div>
          <div
            className="dashboard-card"
            onClick={() => setActiveTab("pending") && statusFilter === ""}
          >
            <h3>Total Pending</h3><p>{totalPending}</p>
          </div>
          <div
            className={`dashboard-card clickable ${statusFilter === "Regular" ? "active-card" : ""}`}
            onClick={() => setStatusFilter("Regular")}
          >
            <h3>Regular</h3>
            <p>{regularStudents}</p>
          </div>

          <div
            className={`dashboard-card clickable ${statusFilter === "Irregular" ? "active-card" : ""}`}
            onClick={() => setStatusFilter("Irregular")}
          >
            <h3>Irregular</h3>
            <p>{irregularStudents}</p>
          </div>
        </div>
      </div>

    </div>
      {/* Enrollment Details Modal */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={handleCloseOutside}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleClose}>X</button>

            <h2>Enrollment Details Hayyssss</h2>

            <div className="student-info-grid">
            {/* Profile Picture */}
            <div className="profile-picture">
              <div className="profile-pic-wrapper">
                <img
                  src={
                    selectedStudent.profile_picture
                      ? `${serverURL.replace(/\/$/, "")}/${selectedStudent.profile_picture.replace(/^\//, "")}`
                      : defaultUser
                  }
                  alt="Profile"
                  className="profile-img"
                />
              </div>
            </div>


              {/* Basic Info */}
              <div className="form-input first-name"><strong>First Name:</strong> {selectedStudent.first_name || "-"}</div>
              <div className="form-input middle-name"><strong>Middle Name:</strong> {selectedStudent.middle_name || "-"}</div>
              <div className="form-input last-name"><strong>Last Name:</strong> {selectedStudent.last_name || "-"}</div>
              <div className="form-input student-id"><strong>Student ID:</strong> {selectedStudent.student_id}</div>
              <div className="form-input year-section"><strong>Year & Section:</strong> {selectedStudent.year_level} {selectedStudent.section || "-"}</div>
              <div className="form-input course"><strong>Course:</strong> {selectedStudent.program_code || "-"}</div>
              <div className="form-input status"><strong>Status:</strong> {selectedStudent.student_status || "-"}</div>

              {/* Subjects Enrolled */}
              <div className="subjects-enrolled">
                <h4>Subjects Enrolled</h4>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Subject</th>
                        <th>Units</th>
                        <th>Section</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentSubjects.length > 0 ? (
                        studentSubjects.map((sub) => (
                          <tr key={sub.subject_code}>
                            <td>{sub.subject_code}</td>
                            <td>{sub.subject_desc}</td>
                            <td>{sub.units}</td>
                            <td>{sub.subject_section}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
                            No enrolled subjects found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Revoke / Confirm Buttons */}
              {activeTab === "pending" && (
                <div>
                  <button className="btn btn-delete" onClick={() => handleEnrollmentAction("revoke")}>Revoke</button>
                  <button className="btn btn-primary" onClick={() => handleEnrollmentAction("confirm")}>Confirm</button>
                </div>
              )}
              </div>
          </div>
        </div>
      )}
    </>
  );
}
