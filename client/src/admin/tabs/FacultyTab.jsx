import React, { useState, useEffect, useMemo } from "react";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/api";
import AdminHeaderControls from "../components/AdminHeaderControls";
import { CustomSelect } from "../../components/customSelect";
import "../css/faculty.css";

export default function FacultyTab({
  settings,
  fetchSettings,
  faculty,
  fetchFaculty,
  departments,
  subjects,
  fetchSubjects,
}) {
  const { addToast } = useToast();
  const { role: userRole } = useAuth();

  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [facultyForm, setFacultyForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department_id: "",
    role: "grader",
    password: "",
  });
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const currentSemester = settings?.current_semester || "1st";
  const currentAcademicYear = settings?.academic_year || "2025-2026";

  useEffect(() => {
    fetchFaculty();
    fetchSubjects();
    fetchSettings();
  }, [fetchFaculty, fetchSubjects, fetchSettings]);

  const filteredFaculty = useMemo(() => {
    return faculty.filter((f) => {
      const fullName = `${f.first_name} ${f.last_name}`.toLowerCase();
      return (
        (f.faculty_id.toString().includes(searchQuery.toLowerCase()) ||
          fullName.includes(searchQuery.toLowerCase())) &&
        (!departmentFilter || f.department_id === parseInt(departmentFilter))
      );
    });
  }, [faculty, searchQuery, departmentFilter]);

  const subjectsByYear = useMemo(() => {
    const grouped = {};
    (subjects || []).forEach((s) => {
      if (s.semester !== currentSemester) return;
      if (!grouped[s.year_level]) grouped[s.year_level] = [];
      grouped[s.year_level].push(s);
    });
    return grouped;
  }, [subjects, currentSemester]);

  const openFaculty = async (faculty) => {
    setSelectedFaculty(faculty);
    setFacultyForm({
      first_name: faculty.first_name,
      last_name: faculty.last_name,
      email: faculty.email,
      department_id: faculty.department_id || "",
      role: faculty.role,
      password: "",
    });

    try {
      const { data } = await API.get(`/faculty/${faculty.faculty_id}/subjects`);
      setAssignedSubjects(
        (data || []).map((s) => ({
          ...s,
          semester: currentSemester,
          academic_year: currentAcademicYear,
          section: s.section || "",
        }))
      );
    } catch (err) {
      console.error(err);
      setAssignedSubjects([]);
    }

    setIsEditing(false);
  };

  const handleFacultyChange = (field, value) =>
    setFacultyForm((prev) => ({ ...prev, [field]: value }));

  // Combined Save function (Add or Edit)
  const handleSaveAll = async () => {
    if (!selectedFaculty || selectedFaculty.faculty_id === null) {
      // Add new faculty
      try {
        const { data } = await API.post("/faculty", facultyForm);
        addToast("Faculty added successfully ✅", "success");

        if (assignedSubjects.length > 0) {
          await API.put(`/faculty/${data.faculty_id}/subjects`, {
            subjects: assignedSubjects.map((s) => ({
              subject_code: s.subject_code,
              year_level: s.year_level,
              section: s.section,
              semester: s.semester,
              academic_year: s.academic_year,
            })),
          });
          addToast("Assigned subjects saved ✅", "success");
        }

        fetchFaculty();
        setSelectedFaculty(null);
        setFacultyForm({
          first_name: "",
          last_name: "",
          email: "",
          department_id: "",
          role: "grader",
          password: "",
        });
        setAssignedSubjects([]);
        setIsEditing(false);
      } catch (err) {
        console.error(err);
        addToast("Failed to save faculty ❌", "error");
      }
    } else {
      // Update existing faculty
      try {
        await API.put(`/faculty/${selectedFaculty.faculty_id}`, facultyForm);

        await API.put(`/faculty/${selectedFaculty.faculty_id}/subjects`, {
          subjects: assignedSubjects.map((s) => ({
            subject_code: s.subject_code,
            year_level: s.year_level,
            section: s.section,
            semester: s.semester,
            academic_year: s.academic_year,
          })),
        });

        addToast("Faculty and assigned subjects updated ✅", "success");
        fetchFaculty();
        setIsEditing(false);
      } catch (err) {
        console.error(err);
        addToast("Failed to update faculty ❌", "error");
      }
    }
  };

  const handleToggleSubject = (subject) => {
    if (assignedSubjects.some((s) => s.subject_code === subject.subject_code)) {
      setAssignedSubjects(assignedSubjects.filter((s) => s.subject_code !== subject.subject_code));
    } else {
      setAssignedSubjects([
        ...assignedSubjects,
        {
          subject_code: subject.subject_code,
          subject_desc: subject.subject_desc,
          year_level: subject.year_level,
          semester: currentSemester,
          section: "",
          academic_year: currentAcademicYear,
        },
      ]);
    }
  };

  const handleSectionChange = (subject_code, section) => {
    setAssignedSubjects(
      assignedSubjects.map((s) =>
        s.subject_code === subject_code ? { ...s, section } : s
      )
    );
  };

  // Delete with confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedFaculty || selectedFaculty.faculty_id === null) return;

    const confirmed = window.prompt(
      `To delete faculty ID ${selectedFaculty.faculty_id}, type "delete" and press OK`
    );

    if (confirmed?.toLowerCase() !== "delete") {
      addToast("Deletion cancelled ❌", "error");
      return;
    }

    try {
      await API.delete(`/faculty/${selectedFaculty.faculty_id}`);
      addToast("Faculty deleted successfully 🗑️", "success");
      fetchFaculty();
      setSelectedFaculty(null);
      setFacultyForm({
        first_name: "",
        last_name: "",
        email: "",
        department_id: "",
        role: "grader",
        password: "",
      });
      setAssignedSubjects([]);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      addToast("Failed to delete faculty ❌", "error");
    }
  };

  if (userRole !== "admin") return <p className="access-denied">Access denied</p>;

  return (
    <div className="faculty-container">
      <AdminHeaderControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        settings={settings}
        tab="faculty"
        departments={departments}
      />

      <div className="faculty-wrapper">
        {/* Faculty List */}
        <div className="faculty-list">
          <h3>Faculty</h3>
          <button
            className="btn btn-primary"
            onClick={() => {
              setSelectedFaculty({ faculty_id: null }); // null indicates new faculty
              setFacultyForm({
                first_name: "",
                last_name: "",
                email: "",
                department_id: "",
                role: "grader",
                password: "",
              });
              setAssignedSubjects([]);
              setIsEditing(true);
            }}
          >
            + Add Faculty
          </button>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Dept</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaculty.map((f) => (
                <tr
                  key={f.faculty_id}
                  className={selectedFaculty?.faculty_id === f.faculty_id ? "selected" : ""}
                  onClick={() => openFaculty(f)}
                >
                  <td>{f.faculty_id}</td>
                  <td>{`${f.first_name} ${f.last_name}`}</td>
                  <td>{f.email}</td>
                  <td>{departments.find((d) => d.department_id === f.department_id)?.department_code || "-"}</td>
                  <td>{f.is_active ? (f.online ? "Online" : "Active") : "Inactive"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Faculty Details */}
        {selectedFaculty && (
          <div className="faculty-details">
            <div className="faculty-header">
              <h3>
                {selectedFaculty.faculty_id === null
                  ? "Add New Faculty"
                  : `${selectedFaculty.first_name} ${selectedFaculty.last_name}`}
              </h3>
            </div>

            {/* Faculty Info Form */}
            <div className="subject-form">
              <div className="form-row two-cols">
                <div className="col">
                  <label> First Name</label>
                  <input
                    placeholder="First Name"
                    value={facultyForm.first_name}
                    onChange={(e) => handleFacultyChange("first_name", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col">
                  <label> Last Name</label>
                  <input
                    placeholder="Last Name"
                    value={facultyForm.last_name}
                    onChange={(e) => handleFacultyChange("last_name", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="form-row full">
                <label>Email</label>
                <input
                  placeholder="Email"
                  value={facultyForm.email}
                  onChange={(e) => handleFacultyChange("email", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-row full">
                <label>Department</label>
                <CustomSelect
                  options={[
                    { value: "", label: "-- Select Department --" },
                    ...departments.map((d) => ({ value: d.department_id, label: d.department_name })),
                  ]}
                  value={facultyForm.department_id}
                  onChange={(val) => handleFacultyChange("department_id", val)}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-row two-cols">
                <div className="col">
                  <label>Role</label>
                  <CustomSelect
                    options={[
                      { value: "dean", label: "Dean" },
                      { value: "advisor", label: "Advisor" },
                      { value: "grader", label: "Grader" },
                    ]}
                    value={facultyForm.role}
                    onChange={(val) => handleFacultyChange("role", val)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder={selectedFaculty.faculty_id === null ? "Password" : "New Password (optional)"}
                    value={facultyForm.password}
                    onChange={(e) => handleFacultyChange("password", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            <hr />

            {/* Assign Subjects */}
            <h4>Assign Subjects</h4>
            <select
              onChange={(e) => {
                const code = e.target.value;
                if (!code) return;
                const selected = subjects.find(
                  (s) => s.subject_code === code && s.semester === currentSemester
                );
                if (selected) handleToggleSubject(selected);
                e.target.value = "";
              }}
              disabled={!isEditing}
            >
              <option value="">-- Select Subject --</option>
              {Object.entries(subjectsByYear).map(([year, subs]) => (
                <optgroup key={year} label={`-- ${year} Year --`}>
                  {subs.map((s) => (
                    <option key={s.subject_code} value={s.subject_code}>
                      {s.subject_code} — {s.subject_desc}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <h4>Assigned Subjects</h4>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Title</th>
                  <th>Year</th>
                  <th>Sections</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {assignedSubjects.map((s) => (
                  <tr key={s.subject_code}>
                    <td>{s.subject_code}</td>
                    <td>{s.subject_desc}</td>
                    <td>{s.year_level}</td>
                    <td>
                      <input
                        type="text"
                        value={s.section || ""}
                        placeholder="A/B/C"
                        onChange={(e) => handleSectionChange(s.subject_code, e.target.value)}
                        disabled={!isEditing}
                      />
                    </td>
                    <td>
                      {isEditing && (
                        <button className="btn btn-delete" onClick={() => handleToggleSubject(s)}>Remove</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Edit / Save / Delete */}
            <button
              className="btn btn-edit"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              {isEditing ? "Cancel Edit" : selectedFaculty.faculty_id === null ? "Cancel Add" : "Edit Faculty"}
            </button>

            {isEditing && (
              <div className="actions">
                <button className="btn btn-primary" onClick={handleSaveAll}>
                  Save All
                </button>
                {selectedFaculty.faculty_id !== null && (
                  <button className="btn btn-delete" onClick={handleDeleteConfirm}>
                    Delete Faculty
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
