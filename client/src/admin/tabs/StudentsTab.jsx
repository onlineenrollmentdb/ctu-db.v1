import React, { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/api";
import AdminHeaderControls from "../components/AdminHeaderControls";
import { CustomSelect } from "../../components/customSelect";

export default function StudentsTab({
  settings,
  students,
  setStudents,
  fetchAllStudents,
  programs,
  fetchPrograms,
}) {
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
  const [statusFilter, setStatusFilter] = useState("");
  const [filterYear, setYearFilter] = useState(""); // added to fix AdminHeaderControls

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  // Delete modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteStudent, setDeleteStudent] = useState(null);
  const [deleteInputs, setDeleteInputs] = useState({ student_id: "", confirm_text: "" });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (fetchPrograms) await fetchPrograms();
        await fetchAllStudents();
      } catch (err) {
        console.error(err);
        addToast("Failed to fetch data ❌", "error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchAllStudents, fetchPrograms, addToast]);

  // Filter students
  const filteredStudents = students.filter((s) => {
    const query = searchQuery.toLowerCase();
    const fullName = `${s.first_name} ${s.last_name} ${s.middle_name || ""}`.toLowerCase();
    const matchesSearch =
      s.student_id.toString().includes(query) || fullName.includes(query);
    const matchesProgram = !programFilter || s.program_id === Number(programFilter);
    const matchesStatus = !statusFilter || s.student_status === statusFilter;
    const matchesYear = !filterYear || s.year_level === Number(filterYear);

    return matchesSearch && matchesProgram && matchesStatus && matchesYear;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + studentsPerPage);

  // Modal functions
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

  // Delete functions
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

  if (userRole !== "admin") return <p className="access-denied">Access denied</p>;

  return (
    <div>
      <AdminHeaderControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        programs={programs}
        programFilter={programFilter}
        setProgramFilter={setProgramFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        filterYear={filterYear} // added
        setYearFilter={setYearFilter} // added
        settings={settings}
        tab="students"
      />

      <div className="students-header d-flex justify-content-between align-items-center">
        <h2>Students Management</h2>
        <button onClick={() => openModal()} className="btn btn-primary">
          + Add Student
        </button>
      </div>

      <div className="modern-table-wrapper">
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
                  <td className="action-buttons d-flex gap-2 justify-content-center">
                    <i
                      className="bi bi-pencil-square text-primary action-icon"
                      title="Edit"
                      onClick={() => openModal(s)}
                      style={{ cursor: "pointer", fontSize: "1.2rem" }}
                    ></i>
                    <i
                      className="bi bi-trash text-danger action-icon"
                      title="Delete"
                      onClick={() => openDeleteModal(s)}
                      style={{ cursor: "pointer", fontSize: "1.2rem" }}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination d-flex justify-content-center align-items-center gap-2 mt-3">
        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
          &lt;
        </button>
        <span>{currentPage} / {totalPages || 1}</span>
        <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}>
          &gt;
        </button>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{editingStudent ? "Edit Student" : "Add Student"}</h3>
            <div className="modal-grid">
              <input placeholder="Student ID" value={form.student_id} onChange={(e) => handleChange("student_id", e.target.value)} />
              <input placeholder="First Name" value={form.first_name} onChange={(e) => handleChange("first_name", e.target.value)} />
              <input placeholder="Last Name" value={form.last_name} onChange={(e) => handleChange("last_name", e.target.value)} />
              <input placeholder="Middle Name" value={form.middle_name} onChange={(e) => handleChange("middle_name", e.target.value)} />
              <CustomSelect
                options={[
                  { value: 1, label: "1st" },
                  { value: 2, label: "2nd" },
                  { value: 3, label: "3rd" },
                  { value: 4, label: "4th" },
                ]}
                value={form.year_level}
                onChange={(val) => handleChange("year_level", val)}
                placeholder="Select Year Level"
              />
              <input placeholder="Email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
              <CustomSelect
                options={programs.map((p) => ({ value: p.program_id, label: p.program_code }))}
                value={form.program_id}
                onChange={(val) => handleChange("program_id", val)}
                placeholder="Select Program"
              />
              <CustomSelect
                options={[
                  { value: "Regular", label: "Regular" },
                  { value: "Irregular", label: "Irregular" },
                ]}
                value={form.student_status}
                onChange={(val) => handleChange("student_status", val)}
                placeholder="Select Status"
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editingStudent ? "Update" : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && deleteStudent && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Delete Student</h3>
            <p>
              To confirm deletion, enter the <strong>Student ID</strong> and type <strong>DELETE</strong> below.
            </p>
            <input
              placeholder="Student ID"
              value={deleteInputs.student_id}
              onChange={(e) => setDeleteInputs(prev => ({ ...prev, student_id: e.target.value }))}
            />
            <input
              placeholder='Type "DELETE" to confirm'
              value={deleteInputs.confirm_text}
              onChange={(e) => setDeleteInputs(prev => ({ ...prev, confirm_text: e.target.value }))}
            />
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={closeDeleteModal}>Cancel</button>
              <button className="btn btn-delete" onClick={handleDeleteConfirm}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
