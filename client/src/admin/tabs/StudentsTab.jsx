import React, { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/api";
import { CustomSelect } from "../../components/customSelect";

export default function StudentsTab({
  students,
  setStudents,
  programs,
  fetchAllStudents,
  setActiveTab,
  onViewDetails,
  fetchPrograms
}) {
  const { addToast } = useToast();
  const { user, role } = useAuth();
  const isAdmin = role === "admin";

  // UI state
  const [expandedProgram, setExpandedProgram] = useState(null);
  const [expandedYear, setExpandedYear] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [facultySubjects, setFacultySubjects] = useState([]);
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [programCode, setProgramCode] = useState("");
  const [programName, setProgramName] = useState("");
  const [departmentId, setDepartmentId] = useState("");


  // Modal / form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form, setForm] = useState({
    student_id: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    year_level: "",
    section: "",
    email: "",
    student_status: "Regular",
    program_id: "",
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteStudent, setDeleteStudent] = useState(null);
  const [deleteInputs, setDeleteInputs] = useState({ student_id: "", confirm_text: "" });

  // Grades state
  const [gradesRecords, setGradesRecords] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  const years = [1, 2, 3, 4];
  const formatYear = (year) => {
    if (year === 1) return "1st";
    if (year === 2) return "2nd";
    if (year === 3) return "3rd";
    return `${year}th`;
  };
  // -----------------------
  // Fetch faculty subjects
  // -----------------------
  useEffect(() => {
    if (!isAdmin) {
      API.get(`/faculty/${user.faculty_id}/subjects`)
        .then(({ data }) => {
          setFacultySubjects(data || []);
          console.log("Fetched faculty subjects:", data);
        })
        .catch((err) => console.error("Failed to fetch faculty subjects:", err))
    }
  }, [isAdmin, user]);

  // -----------------------
  // Filter students
  // -----------------------
  useEffect(() => {
    if (selectedSection && expandedProgram && expandedYear) {
      const filtered = students.filter(
        (s) =>
          s.program_id === expandedProgram &&
          Number(s.year_level) === Number(expandedYear) &&
          s.section === selectedSection
      );
      setFilteredStudents(filtered);
      setCurrentPage(1);
    } else {
      setFilteredStudents([]);
    }
  }, [selectedSection, expandedProgram, expandedYear, students]);

  // -----------------------
  // Fetch available subjects
  // -----------------------
  useEffect(() => {
    if (!selectedSection || !expandedProgram || !expandedYear) {
      setAvailableSubjects([]);
      setSelectedSubject(null);
      setGradesRecords([]);
      return;
    }

    if (isAdmin) {
      API.get(`/subjects?program_id=${expandedProgram}`)
        .then(({ data }) => {
          const subjects = (data || []).filter((s) => {
            const sections = (s.section || "").toString().split("/").map((x) => x.trim());
            return Number(s.year_level) === Number(expandedYear) && sections.includes(selectedSection);
          });
          setAvailableSubjects(subjects);
          setSelectedSubject(subjects[0] || null);
        })
        .catch(console.error);
    } else {
      // Faculty subjects
      const subjects = (facultySubjects || []).filter((fs) => {
        const sections = (fs.section || "").toString().split("/").map((x) => x.trim());
        const matchesSection = sections.includes(selectedSection);
        const matchesYear = Number(fs.year_level) === Number(expandedYear);
        const matchesProgram = fs.program_id ? fs.program_id === expandedProgram : true; // allow undefined program_id
        return matchesSection && matchesYear && matchesProgram;
      });
      setAvailableSubjects(subjects);
      setSelectedSubject(subjects[0] || null);

      if (subjects.length === 1) {
        prepareGradesRecords(subjects[0]).catch(console.error);
      } else {
        setGradesRecords([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSection, expandedProgram, expandedYear, facultySubjects, isAdmin]);

  // -----------------------
  // Fetch grades when selectedSubject changes
  // -----------------------
  useEffect(() => {
    if (!selectedSubject) {
      setGradesRecords([]);
      return;
    }
    prepareGradesRecords(selectedSubject).catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubject, filteredStudents]);

  // -----------------------
  // Compute rating
  // -----------------------
  const computeRating = (grade) => {
    if (grade === "" || grade === null || grade === undefined) return "";
    const g = parseFloat(grade);
    if (Number.isNaN(g)) return "";
    if (g === 0) return "INC";
    if (g <= 3.0) return "Passed";
    return "Failed";
  };

  // -----------------------
  // Helper functions
  // -----------------------
  const getProgramCount = (programId) => students.filter((s) => s.program_id === programId).length;

  const getSectionsForYear = (programId, yearLevel) => {
    const yearStudents = students.filter(
      (s) => s.program_id === programId && Number(s.year_level) === Number(yearLevel)
    );
    const uniqueSections = [...new Set(yearStudents.map((s) => s.section))].sort();
    return uniqueSections.map((sec) => {
      let hasSubject = false;
      if (!isAdmin) {
        hasSubject = facultySubjects.some((fs) => {
          const secs = (fs.section || "").toString().split("/").map((x) => x.trim());
          return Number(fs.year_level) === Number(yearLevel) && secs.includes(sec);
        });
      }
      return {
        name: sec,
        count: yearStudents.filter((s) => s.section === sec).length,
        hasSubject,
      };
    });
  };

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + studentsPerPage);

  // -----------------------
  // Header render
  // -----------------------
  const renderHeader = () => {
    if (!expandedProgram) return <h1 className="header-main">STUDENT MANAGEMENT</h1>;
    if (expandedProgram && !selectedSection) {
      return (
        <>
          <h1 className="header-main">STUDENT MANAGEMENT</h1>
          <h2 className="header-sub">{programs.find((p) => p.program_id === expandedProgram)?.program_code}</h2>
        </>
      );
    }
    return (
      <>
        <h1 className="header-main">STUDENT MANAGEMENT</h1>
        <h2 className="header-sub">
          {programs.find((p) => p.program_id === expandedProgram)?.program_code}-{expandedYear}
          {selectedSection}
        </h2>
      </>
    );
  };

  const handleViewDetails = (student) => {
    onViewDetails(student);
  };

  // -----------------------
  // Modal helpers
  // -----------------------
  const openModal = (student = null) => {
    setEditingStudent(student);
    setForm(
      student
        ? { ...student, program_id: student.program_id || "" }
        : {
            student_id: "",
            first_name: "",
            last_name: "",
            middle_name: "",
            year_level: "",
            section: "",
            email: "",
            student_status: "Regular",
            program_id: "",
          }
    );
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditingStudent(null);
  };
  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    try {
      if (!form.program_id) {
        addToast("Please select a program ❌", "error");
        return;
      }
      let response;
      if (editingStudent) {
        response = await API.put(`admin/students/${editingStudent.student_id}`, form);
        setStudents((prev) =>
          prev.map((s) => (s.student_id === editingStudent.student_id ? response.data.student : s))
        );
        addToast("Student updated successfully ✅", "success");
      } else {
        response = await API.post(`admin/students`, form);
        setStudents((prev) => [...prev, response.data.student]);
        addToast("Student added successfully ✅", "success");
      }
      closeModal();
    } catch (err) {
      console.error(err);
      addToast("Failed to save student ❌", "error");
    }
  };

  // -----------------------
  // Delete helpers
  // -----------------------
  const openDeleteModal = (student) => {
    setDeleteStudent(student);
    setDeleteInputs({ student_id: "", confirm_text: "" });
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setDeleteStudent(null);
    setDeleteInputs({ student_id: "", confirm_text: "" });
    setDeleteModalOpen(false);
  };
  const handleDeleteConfirm = async () => {
    if (!deleteStudent) return;
    if (
      deleteInputs.student_id !== deleteStudent.student_id.toString() ||
      deleteInputs.confirm_text.toLowerCase() !== "delete"
    ) {
      addToast("Student ID or confirmation text is incorrect ❌", "error");
      return;
    }
    try {
      await API.delete(`admin/students/${deleteStudent.student_id}`);
      addToast("Student deleted successfully 🗑️", "success");
      fetchAllStudents();
      closeDeleteModal();
    } catch {
      addToast("Failed to delete student ❌", "error");
    }
  };

  // -----------------------
  // Grades helpers
  // -----------------------
  const prepareGradesRecords = async (subject) => {
    if (!subject) {
      setGradesRecords([]);
      return;
    }
    const records = await Promise.all(
      filteredStudents.map(async (stu) => {
        const res = await API.get(`/grades/student/${stu.student_id}`);
        const studentRecord = (res.data.records || []).find(
          (r) => r.subject_section === subject.subject_section
        );
        return {
          student_id: stu.student_id,
          subject_section: subject.subject_section,
          grade: studentRecord?.grade === null || studentRecord?.grade === undefined ? "" : studentRecord?.grade,
        };
      })
    );
    setGradesRecords(records);
  };

  const handleGradeChange = (student_id, value) => {
    setGradesRecords((prev) =>
      prev.map((r) => (r.student_id === student_id ? { ...r, grade: value } : r))
    );
  };

  const handleSaveGrades = async () => {
    if (!selectedSubject) {
      addToast("No subject selected ❌", "error");
      return;
    }
    try {
      await Promise.all(
        gradesRecords.map((rec) =>
          API.put(`/grades/student/${rec.student_id}`, {
            records: [
              {
                subject_section: rec.subject_section,
                grade: rec.grade === "" ? null : rec.grade,
              },
            ],
          })
        )
      );
      addToast("Grades saved successfully ✅", "success");
      await fetchAllStudents();
      await prepareGradesRecords(selectedSubject);
    } catch (err) {
      console.error(err);
      addToast("Failed to save grades ❌", "error");
    }
  };

  const handleAddProgram = async () => {
    try {
      const response = await API.post("/programs/add", {
        program_code: programCode,
        program_name: programName,
        department_id: departmentId
      });

      addToast(response.data.message, "success");
      setShowAddProgram(false);
      fetchPrograms(); // make sure this refreshes UI
    } catch (err) {
      addToast(err.response?.data?.error || "Something went wrong", "error");
    }
  };



  // -----------------------
  // Render
  // -----------------------
  if (!["admin", "faculty"].includes(role)) return <p>Access denied</p>;

  return (
    <div>
      <div className="students-container">
        <div className="header-sub flex justify-between items-center">{
          renderHeader()}
          {/* Faculty subject picker */}
          {selectedSection && !isAdmin && availableSubjects.length > 0 && (
            <div className="subject-selection">
              <h3>Subject Assigned</h3>
              <CustomSelect
                options={availableSubjects.map((s) => ({
                  value: s.subject_section,
                  label: s.subject_code + (s.subject_desc ? ` — ${s.subject_desc}` : ""),
                }))}
                value={selectedSubject?.subject_section}
                onChange={(val) => {
                  const subj = availableSubjects.find((s) => s.subject_section === val);
                  setSelectedSubject(subj || null);
                }}
                placeholder={availableSubjects.length === 1 ? "Subject (auto-selected)" : "Select Subject"}
              />
            </div>
          )}
        </div>
        {/* Back button */}
        {(expandedProgram || selectedSection)
        && ( <button className="back-button mb-4" onClick={() => {
          if (selectedSection) setSelectedSection(null);
          else { setExpandedProgram(null); setExpandedYear(null); } }} >
          &larr;
            Back
          </button> )}
        {/* Step 1: Programs */}
        {!expandedProgram && (
          <>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => setShowAddProgram(true)}>
              Add Program
            </button>
          )}
          <div className="programs-grid">
            {programs.map((program) => (
              <div
                key={program.program_id}
                className="program-card"
                onClick={() => setExpandedProgram(program.program_id)}
              >
                <h2>
                  {program.program_name} ({program.program_code})
                </h2>
                <p className="text-gray-600 mt-2">{getProgramCount(program.program_id)} Students</p>
              </div>
            ))}
          </div>
          </>
        )}

        {/* Step 2: Years & Sections */}
        {expandedProgram && !selectedSection && (
          <>
            {isAdmin && (
              <button className="btn btn-primary" onClick={() => openModal()}>
                Add Student
              </button>
            )}
            <div className="years-grid">
              {years.map((year) => {
                const sections = getSectionsForYear(expandedProgram, year);
                if (!sections || sections.length === 0) return null;
                return (
                  <div key={year} className="year-card">
                    <h4 className="year-title">{formatYear(year)} Year</h4>
                    <div className="sections-grid">
                      {sections.map((sec) => (
                        <div
                          key={sec.name}
                          className={`section-card ${sec.hasSubject ? "highlight" : ""}`}
                          onClick={() => {
                            setExpandedYear(year);
                            setSelectedSection(sec.name);
                            setSelectedSubject(null);
                            setAvailableSubjects([]);
                            setGradesRecords([]);
                          }}
                        >
                          <span>{sec.name}</span>
                          <span>{sec.count} Students</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Step 3: Students Table */}
        {selectedSection && (
          <div className="students-table">
            <div className="students-header flex justify-between items-center my-4">
              {/* Save Grades Button */}
              {!isAdmin && selectedSubject && gradesRecords.length > 0 && (
                <button className="btn btn-primary" onClick={handleSaveGrades}>
                  Save Grades
                </button>
              )}
            </div>

            <div className="modern-table-wrapper hs">
              {filteredStudents.length > 0 ? (
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      {!isAdmin && availableSubjects.length > 0 && <th>Grade</th>}
                      {!isAdmin && availableSubjects.length > 0 && <th>Rating</th>}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStudents.map((s) => {
                      const foundGrade = gradesRecords.find((r) => r.student_id === s.student_id);
                      const currentGrade = foundGrade ? foundGrade.grade : "";
                      const rating = computeRating(currentGrade);
                      return (
                        <tr key={s.student_id}>
                          <td>{s.student_id}</td>
                          <td>{`${s.first_name} ${s.last_name}`}</td>
                          <td>{s.email}</td>
                          <td>{s.student_status}</td>
                          {!isAdmin && availableSubjects.length > 0 && (
                            <td>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="5"
                                value={currentGrade ?? ""}
                                onChange={(e) => handleGradeChange(s.student_id, e.target.value)}
                                style={{ width: 80 }}
                              />
                            </td>
                          )}
                          {!isAdmin && availableSubjects.length > 0 && <td>{rating || "-"}</td>}

                          <td className="actions-cell">
                            <i className="bi bi-three-dots-vertical menu-icon"></i>
                            <div className="actions-menu">
                              <button onClick={() => handleViewDetails(s)} data-tooltip="View">
                                <i className="bi bi-eye"></i>
                              </button>
                              {isAdmin && (
                                <>
                                <button onClick={() => openModal(s)} data-tooltip="Edit">
                                  <i className="bi bi-pencil-square"></i>
                                </button>
                                <button onClick={() => openDeleteModal(s)} data-tooltip="Delete">
                                  <i className="bi bi-trash"></i>
                                </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p>No students found for this selection.</p>
              )}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={currentPage === i + 1 ? "active" : ""}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {modalOpen && (
      <div className="modal-overlay">
          <div className="modal-box">
            <h3>{editingStudent ? "Edit Student" : "Add Student"}</h3>
            <div className="modal-grid">
              <input
                type="text"
                placeholder="First Name"
                value={form.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={form.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
              />
              <input
                type="text"
                placeholder="Middle Name"
                value={form.middle_name}
                onChange={(e) => handleChange("middle_name", e.target.value)}
              />
              <input
                type="text"
                placeholder="Email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              <input
                type="text"
                placeholder="Section"
                value={form.section}
                onChange={(e) => handleChange("section", e.target.value)}
              />
              <input
                type="number"
                placeholder="Year Level"
                value={form.year_level}
                onChange={(e) => handleChange("year_level", e.target.value)}
              />
              <div className="full">
                <CustomSelect
                  options={programs.map((p) => ({ value: p.program_id, label: p.program_code }))}
                  value={form.program_id}
                  onChange={(val) => handleChange("program_id", val)}
                  placeholder="Select Program"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
              <button className="btn btn-cancel" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
      </div>
      )}
      {deleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Delete Student</h3>
            <div className="modal-grid">
              <input
                type="text"
                placeholder="Student ID"
                value={deleteInputs.student_id}
                onChange={(e) => setDeleteInputs((prev) => ({ ...prev, student_id: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Type DELETE to confirm"
                value={deleteInputs.confirm_text}
                onChange={(e) => setDeleteInputs((prev) => ({ ...prev, confirm_text: e.target.value }))}
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={handleDeleteConfirm}>
                Confirm Delete
              </button>
              <button className="btn btn-cancel" onClick={closeDeleteModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddProgram && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Add Program</h3>

            <div className="modal-grid">
              <input
                type="text"
                placeholder="Program Code (ex: BSIT)"
                value={programCode}
                onChange={(e) => setProgramCode(e.target.value)}
              />

              <input
                type="text"
                placeholder="Program Name (ex: Information Technology)"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
              />

              <input
                type="number"
                placeholder="Department ID"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleAddProgram}>Save</button>
              <button className="btn btn-cancel" onClick={() => setShowAddProgram(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
