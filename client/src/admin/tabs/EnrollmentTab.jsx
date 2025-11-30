import React, { useState, useEffect } from "react";
import AdminHeaderControls from "../components/AdminHeaderControls";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import API from "../../api/api";
import { useToast } from "../../context/ToastContext";
import defaultUser from "../../img/default_user.webp";
import "../css/enrollment.css";

export default function EnrollmentTab({ settings, filterYear, setYearFilter, programs, students, setStudents }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [programFilter, setProgramFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSubjects, setStudentSubjects] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");

  const studentsPerPage = 20;
  const { addToast } = useToast();

  const serverURL = process.env.REACT_APP_SOCKET;

  const handleExportPDF = () => {
    // Only allow export from Enrolled tab
    if (activeTab !== "enrolled") {
      addToast("You can only export students from the Enrolled tab ❌", "error");
      return;
    }

    // Determine which students to export based on status filter
    let exportStudents = [];
    if (statusFilter === "Regular") {
      if (regularStudents === 0) {
        addToast("No Regular students to export ❌", "error");
        return;
      }
      exportStudents = students.filter(
        (s) => s.enrollment_status === 3 && s.student_status === "Regular"
      );
    } else if (statusFilter === "Irregular") {
      if (irregularStudents === 0) {
        addToast("No Irregular students to export ❌", "error");
        return;
      }
      exportStudents = students.filter(
        (s) => s.enrollment_status === 3 && s.student_status === "Irregular"
      );
    } else {
      // If no status filter, export all enrolled students
      if (totalEnrolled === 0) {
        addToast("No enrolled students to export ❌", "error");
        return;
      }
      exportStudents = students.filter((s) => s.enrollment_status === 3);
    }

    // Prepare table data
    const tableColumn = ["Student ID", "Full Name", "Year", "Section", "Program", "Status"];
    const tableRows = exportStudents.map((s) => [
      s.student_id,
      `${s.last_name}, ${s.first_name} ${s.middle_name || ""}`,
      s.year_level,
      s.section || "-",
      s.program_name || "-",
      s.student_status || "-",
    ]);

    // Create PDF
    const doc = new jsPDF();

    // Header
    doc.setFontSize(16);
    doc.text("Student Enrollment List", 14, 20);
    doc.setFontSize(10);
    doc.text(`Academic Year: ${settings?.current_academic_year || "N/A"}`, 14, 28);
    doc.text(`Semester: ${settings?.current_semester || "N/A"}`, 14, 34);
    doc.text(`Status: Enrolled${statusFilter ? " - " + statusFilter : ""}`, 14, 40);

    // Table
    autoTable(doc, {
      startY: 50,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    // Save
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    doc.save(`${today}_EnrolledStudents.pdf`);

    addToast("PDF Export successful ✅", "success");
  };

  // 🔹 View details modal + fetch subjects
  const handleViewDetails = async (student) => {
    setSelectedStudent(student);

    try {
      const res = await API.get(`admin/students/${student.student_id}/subjects`);

      setStudentSubjects(res.data.subjects || []);

      setSelectedStudent((prev) => ({
        ...prev,
        academic_year: res.data.academic_year,
        semester: res.data.semester,
      }));
    } catch (err) {
      console.error("Error fetching subject records:", err);
      addToast("Failed to load subject records ❌", "error");
      setStudentSubjects([]);
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
    const matchesProgram = !programFilter || s.program_name === programFilter;

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

      <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "1.5rem" }}>
        {/* Enrollment List */}
        <div>
          <div className="dashboard-section">
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
                        <td>{s.program_name || "-"}</td>
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
        </div>

        {/* Stats Cards */}
        <div className="dashboard-cards" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            className="dashboard-card"
            onClick={() => setActiveTab("enrolled")}
          >
            <h3>Total Enrolled</h3><p>{totalEnrolled}</p>
          </div>
          <div
            className="dashboard-card"
            onClick={() => setActiveTab("pending")}
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

      {/* Enrollment Details Modal */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={handleCloseOutside}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleClose}>X</button>

            <h2>Enrollment Details</h2>

            <div className="student-info-grid">
              {/* Profile Picture */}
              <div className="profile-picture">
                <img
                  src={
                    selectedStudent.profile_picture
                      ? `${serverURL}/${selectedStudent.profile_picture.replace(/^\/+/, "")}`
                      : defaultUser
                  }
                  alt="Profile"
                  className="profile-image"
                />
              </div>

              {/* Basic Info */}
              <div className="form-input first-name"><strong>First Name:</strong> {selectedStudent.first_name || "-"}</div>
              <div className="form-input middle-name"><strong>Middle Name:</strong> {selectedStudent.middle_name || "-"}</div>
              <div className="form-input last-name"><strong>Last Name:</strong> {selectedStudent.last_name || "-"}</div>
              <div className="form-input student-id"><strong>Student ID:</strong> {selectedStudent.student_id}</div>
              <div className="form-input year-section"><strong>Year & Section:</strong> {selectedStudent.year_level} {selectedStudent.section || "-"}</div>
              <div className="form-input course"><strong>Course:</strong> {selectedStudent.program_name || "-"}</div>
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
              <button className="btn btn-delete" onClick={() => handleEnrollmentAction("revoke")}>Revoke</button>
              <button className="btn btn-primary" onClick={() => handleEnrollmentAction("confirm")}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
