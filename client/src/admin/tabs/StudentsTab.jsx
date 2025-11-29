import React, { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/api";
import AdminHeaderControls from "../components/AdminHeaderControls";

export default function StudentsTab({ settings, students, setStudents, fetchStudents, programs, fetchPrograms }) {
  const { addToast } = useToast();
  const { role: userRole } = useAuth();

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [form, setForm] = useState({
    student_id: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    year_level: "",
    email: "",
    student_status: "Regular",
    program_id: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [programFilter, setProgramFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (fetchPrograms) await fetchPrograms();
        await fetchStudents();
      } catch (err) {
        console.error(err);
        addToast("Failed to fetch data ❌", "error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchStudents, fetchPrograms, addToast]);

  // Filtered students
  const filteredStudents = students.filter((s) => {
    const query = searchQuery.toLowerCase();
    const fullName = `${s.first_name} ${s.last_name} ${s.middle_name || ""}`.toLowerCase();
    const matchesSearch =
      s.student_id.toString().includes(query) || fullName.includes(query);
    const matchesProgram =
      !programFilter || s.program_id === Number(programFilter);
    return matchesSearch && matchesProgram;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + studentsPerPage);

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

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

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

  const handleDelete = async (student_id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await API.delete(`/students/${student_id}`);
      addToast("Student deleted successfully 🗑️", "success");
      fetchStudents();
    } catch {
      addToast("Failed to delete student ❌", "error");
    }
  };

  if (userRole !== "admin") return <p className="access-denied">Access denied</p>;

  return (
    <div className="students-wrapper">
      <AdminHeaderControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        programs={programs}
        programFilter={programFilter}
        setProgramFilter={setProgramFilter}
        settings={settings}
        tab="students"
      />

      <div className="students-header">
        <h2>Students Management</h2>
        <button onClick={() => openModal()} className="btn btn-primary">
          + Add Student
        </button>
      </div>

      <div className="student table-container">
        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : (
          <table className="modern-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Year</th>
                <th>Status</th>
                <th>Program</th>
                <th>Enrollment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((s) => (
                <tr key={s.student_id}>
                  <td>{s.student_id}</td>
                  <td>{`${s.first_name} ${s.last_name}`}</td>
                  <td>{s.email}</td>
                  <td>{s.year_level}</td>
                  <td>{s.student_status}</td>
                  <td>{programs.find((p) => p.program_id === s.program_id)?.program_code || "-"}</td>
                  <td>
                    {{
                      0: "Not Cleared",
                      1: "Cleared",
                      2: "Pending Enrollment",
                      3: "Enrolled",
                    }[s.enrollment_status] || "Not Active"}
                  </td>
                  <td className="action-buttons">
                    <button className="btn btn-primary" onClick={() => openModal(s)}>Edit</button>
                    <button className="btn btn-delete" onClick={() => handleDelete(s.student_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
          &lt;
        </button>
        <span>
          {currentPage} / {totalPages || 1}
        </span>
        <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}>
          &gt;
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{editingStudent ? "Edit Student" : "Add Student"}</h3>
            <div className="modal-grid">
              <input placeholder="Student ID" value={form.student_id} onChange={(e) => handleChange("student_id", e.target.value)} />
              <input placeholder="First Name" value={form.first_name} onChange={(e) => handleChange("first_name", e.target.value)} />
              <input placeholder="Last Name" value={form.last_name} onChange={(e) => handleChange("last_name", e.target.value)} />
              <input placeholder="Middle Name" value={form.middle_name} onChange={(e) => handleChange("middle_name", e.target.value)} />
              <input placeholder="Year Level" value={form.year_level} onChange={(e) => handleChange("year_level", e.target.value)} />
              <input placeholder="Email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
              <select value={form.program_id || ""} onChange={(e) => handleChange("program_id", Number(e.target.value))}>
                <option value="">Select Program</option>
                {programs.map((p) => <option key={p.program_id} value={p.program_id}>{p.program_code}</option>)}
              </select>
              <select value={form.student_status} onChange={(e) => handleChange("student_status", e.target.value)}>
                <option value="Regular">Regular</option>
                <option value="Irregular">Irregular</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>{editingStudent ? "Update" : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
