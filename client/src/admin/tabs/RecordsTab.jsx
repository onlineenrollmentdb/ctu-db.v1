import React, { useState, useEffect, useCallback, useRef } from "react";
import API from "../../api/api";
import AdminHeaderControls from "../components/AdminHeaderControls";
import { useToast } from "../../context/ToastContext";
import { connectSocket, getSocket, disconnectSocket } from "../../socket";
import defaultUser from "../../img/default_user.webp";
import "../../css/ProfilePage.css";
import "../../css/GradesPage.css";
import "../css/records.css";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RecordsTab({
  students,
  settings,
  searchQuery,
  setSearchQuery,
  selectedStudent,
  setSelectedStudent,
  initialSearch,
  programFilter,
  setProgramFilter,
  filteredStudents,
  userRole,
}) {
  const [filtered, setFiltered] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState({});
  const [saving, setSaving] = useState(false);
  const [isEditingGrades, setIsEditingGrades] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [studentForm, setStudentForm] = useState({});
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    connectSocket(); // connect once

    const s = getSocket();
    if (s) setSocketInstance(s);

    return () => disconnectSocket();
  }, []);

  const inputRef = useRef(null);
  const searchWrapperRef = useRef(null);
  const { addToast } = useToast();
  // 🔹 Toggle states
  const toggleEditingGrades = () => {
    if (isEditingGrades) setEdited({});
    setIsEditingGrades(prev => !prev);
  };

  const toggleEditingDetails = () => {
    if (isEditingDetails && selectedStudent) {
      setStudentForm({ ...selectedStudent }); // Reset on cancel
    }
    setIsEditingDetails(prev => !prev);
  };

  // 🔹 Fetch subjects
  const fetchSubjects = useCallback(async studentId => {
    setLoading(true);
    try {
      const res = await API.get(`grades/student/${studentId}`);
      setSubjects(res.data.records || []);
      setEdited({});
    } catch (err) {
      console.error("Error fetching student records:", err);
      addToast("Failed to load student records ❌", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // 🔹 Helper to safely construct full name
  const getSafeFullName = (s) =>
    `${s.first_name || ""} ${s.middle_name || ""} ${s.last_name || ""}`.replace(/\s+/g, ' ').trim();

  // 🔹 Select student
  const handleSelectStudent = useCallback(
    async (student) => {
      try {
        setLoading(true);

        // Fetch full student record from backend
        const res = await API.get(`/students/${student.student_id}`);
        const fullStudent = res.data;

        const fullName = getSafeFullName(fullStudent); // ✅ Construct full name safely

        setSelectedStudent(fullStudent);
        setStudentForm(fullStudent); // full student info
        setFiltered([]);
        setSearchQuery(fullName); // ✅ Always include middle name
        if (inputRef.current) inputRef.current.blur();

        await fetchSubjects(fullStudent.student_id);
      } catch (err) {
        console.error("Failed to fetch full student data:", err);
        addToast("Failed to load student details ❌", "error");
      } finally {
        setLoading(false);
      }
    },
    [setSelectedStudent, setSearchQuery, fetchSubjects, addToast]
  );

  useEffect(() => {
    connectSocket();              // connect once
    return () => disconnectSocket();  // clean up on unmount
  }, []);

  // Initial search
  useEffect(() => {
    if (initialSearch && initialSearch.student_id) {
      // Only select if not already selected
      if (!selectedStudent || selectedStudent.student_id !== initialSearch.student_id) {
        setSearchQuery(initialSearch.full_name);
        handleSelectStudent(initialSearch);
      }
    }
  }, [initialSearch, handleSelectStudent, setSearchQuery, selectedStudent]);


  // Search filter
  useEffect(() => {
    if (!searchQuery) {
      setFiltered([]);
      return;
    }
    const term = searchQuery.toLowerCase();
    const matches = students.filter(
      s =>
        s.student_id.toString().includes(term) ||
        (s.first_name && s.first_name.toLowerCase().includes(term)) ||
        (s.middle_name && s.middle_name.toLowerCase().includes(term)) ||
        (s.last_name && s.last_name.toLowerCase().includes(term)) ||
        (s.full_name && s.full_name.toLowerCase().includes(term))
    );
    setFiltered(matches.slice(0, 5));
  }, [searchQuery, students]);

  // Fetch subjects on selectedStudent change
  useEffect(() => {
    if (!selectedStudent) return;
    fetchSubjects(selectedStudent.student_id);
  }, [selectedStudent, fetchSubjects]);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setFiltered([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute grade status
  const computeStatusPreview = (gradeVal, originalStatus) => {
    if (gradeVal === "" || gradeVal === null || typeof gradeVal === "undefined") return originalStatus ?? "";
    const n = parseFloat(gradeVal);
    if (isNaN(n)) return originalStatus ?? "";
    if (n === 0) return "INC";
    return n <= 3.0 ? "Passed" : "Failed";
  };

  // Handle grade change
  const handleGradeChange = (subject_section, field, value) => {
    setEdited(prev => {
      const prevRec = prev[subject_section] || {};
      return { ...prev, [subject_section]: { ...prevRec, [field]: value } };
    });
  };

  const hasEdits = Object.keys(edited).length > 0;

  // Save grades
  const handleSaveGrades = async () => {
    if (!selectedStudent) return;
    const records = Object.entries(edited).map(([subject_section, obj]) => {
      const subj = subjects.find(s => s.subject_section === subject_section);
      return {
        student_id: selectedStudent.student_id,
        subject_section,
        grade: obj.grade === "" ? null : obj.grade,
        academic_year: obj.academic_year ?? subj?.academic_year ?? settings.current_academic_year,
        semester: obj.semester ?? subj?.semester ?? settings.current_semester,
      };
    });
    setSaving(true);
    try {
      const res = await API.put(`grades/student/${selectedStudent.student_id}`, { records });
      await fetchSubjects(selectedStudent.student_id);
      setEdited({});
      setIsEditingGrades(false);

      if (res.data?.student_status) {
        setSelectedStudent(prev => prev ? { ...prev, student_status: res.data.student_status } : prev);
      }

      socketInstance?.emit("studentUpdated", {
        student_id: selectedStudent.student_id,
        student_status: res.data?.student_status,
      });

      addToast("Grades updated successfully 🎓", "success");
    } catch (err) {
      console.error("Error saving grades:", err);
      addToast("Failed to save grades", "error");
    } finally {
      setSaving(false);
    }
  };

  // Save student details
  const handleSaveDetails = async () => {
    if (!selectedStudent) return;
    setSaving(true);
    try {
      await API.put(`/students/${selectedStudent.student_id}`, studentForm);
      setSelectedStudent(prev => prev ? { ...prev, ...studentForm } : prev);
      setIsEditingDetails(false);
      addToast("Student details updated 🧾", "success");
    } catch (err) {
      console.error("Error updating student details:", err);
      addToast("Failed to update student details", "error");
    } finally {
      setSaving(false);
    }
  };

  // Handle detail change
  const handleDetailChange = (field, value) => {
    setStudentForm(prev => ({ ...prev, [field]: value }));
  };

  const serverURL = process.env.REACT_APP_API.replace("/api", "");
  const profilePicture = studentForm.profile_picture
      ? `${serverURL}${studentForm.profile_picture}`
      : defaultUser;

  return (
    <div className="records-tab">
      <AdminHeaderControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        programFilter={programFilter}
        setProgramFilter={setProgramFilter}
        settings={settings}
        tab="records"
        filter={filtered}
        filteredStudents={filteredStudents}
        handleSelectStudent={handleSelectStudent}
        selectedStudent={selectedStudent}
      />

      {selectedStudent ? (
        <div className="students-layout">
          {/* 🔹 Profile Card */}
          <div className="profile-wrapper">
            <div className="profile-card">
              <h2 className="profile-header">Student Details</h2>

              <div className="profile-grid-advanced">
                {/* Profile Picture */}
                <div className="profile-picture">
                  <div className={`profile-pic-wrapper ${isEditingDetails ? "editable" : ""}`}>
                    <img src={profilePicture || defaultUser} alt="Profile" className="profile-img" />
                    {isEditingDetails && (
                      <div className="overlay">
                        <span>Change Profile?</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleDetailChange("profile_picture", e.target.files[0])}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Editable Fields */}
                {[
                  ["First Name", "first_name"], ["Middle Name", "middle_name"], ["Last Name", "last_name"],
                  ["Contact Number", "contact_number"], ["Student ID", "student_id"], ["Permanent Address", "permanent_address"],
                  ["District", "congressional_district"], ["Gender", "gender"], ["Region", "region"],
                  ["Email", "email"], ["Course", "program_code"], ["Civil Status", "civil_status"],
                  ["Year & Section", "year_section"], ["Citizenship", "citizenship"], ["Birthday", "birth_date"],
                  ["Birth Place", "birthplace"], ["Religion", "religion"], ["Status", "student_status"],
                  ["Father's Name", "father_name"], ["Mother's Name", "mother_name"],
                  ["Father's Occupation", "father_occupation"], ["Mother's Occupation", "mother_occupation"],
                  ["Guardian's Name", "guardian_name"], ["Relation to Guardian", "guardian_relationship"],
                  ["Guardian Contact", "guardian_contact"], ["Enrollment Status", "is_enrolled"]
                ].map(([label, field]) => (
                  <ProfileField
                    key={field}
                    label={label}
                    name={field}
                    value={
                      field === "year_section"
                        ? `${studentForm.year_level} - ${studentForm.section}`
                        : field === "is_enrolled"
                        ? studentForm.is_enrolled === 1 ? "Enrolled" : "Not Enrolled"
                        : studentForm[field]
                    }
                    editable={isEditingDetails && !["student_id", "program_code", "year_section", "student_status", "is_enrolled"].includes(field)}
                    onChange={handleDetailChange}
                    type={field === "birth_date" ? "date" : "text"}
                  />
                ))}
              </div>

              {/* Actions */}
              {userRole === "admin" && (
                <div className="profile-actions">
                  {isEditingDetails ? (
                    <>
                      <button className="btn btn-primary" onClick={handleSaveDetails} disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button className="btn btn-cancel" onClick={() => { setIsEditingDetails(false); setStudentForm({ ...selectedStudent }); }}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-edit" onClick={toggleEditingDetails}>Edit Details</button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 🔹 Subject Records Table */}
          <div className="modern-table-wrapper">
            <div className="subject-records-header">
              <h3>Subject Records</h3>
            </div>

            {loading ? (
              <p>Loading subjects...</p>
            ) : (
              <div className="modern-table">
                <table>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Description</th>
                      <th>Units</th>
                      <th>Grade</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(
                      [...subjects].reduce((groups, subj) => {
                        const key = `Year ${subj.year_level} - ${subj.semester === 1 ? "1st" : subj.semester === 2 ? "2nd" : subj.semester} Semester`;
                        if (!groups[key]) groups[key] = [];
                        groups[key].push(subj);
                        return groups;
                      }, {})
                    ).map(([group, records], idx) => {
                      const sortedRecords = records.sort((a, b) => a.subject_code.localeCompare(b.subject_code));
                      return (
                        <React.Fragment key={group}>
                          {idx > 0 && <tr><td colSpan={5} className="semester-divider"></td></tr>}
                          <tr><td colSpan={5} className="group-cell">{group}</td></tr>
                          {sortedRecords.map((s, i) => {
                            const editedRec = edited[s.subject_section];
                            const gradeValue = editedRec ? editedRec.grade : s.grade ?? "";
                            const statusPreview = computeStatusPreview(editedRec && editedRec.grade !== undefined ? editedRec.grade : s.grade, s.status);
                            return (
                              <tr key={`${group}-${i}`}>
                                <td>{s.subject_code}</td>
                                <td>{s.subject_desc || "—"}</td>
                                <td>{s.units || "—"}</td>
                                <td>
                                  {isEditingGrades ? (
                                    <input className="grades-input" type="text" value={gradeValue ?? ""} onChange={e => handleGradeChange(s.subject_section, "grade", e.target.value)} />
                                  ) : s.grade ?? "-"}
                                </td>
                                <td>{statusPreview ?? ""}</td>
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

              {isEditingGrades && hasEdits && (
                <div className="subjects-actions">
                  <button className="btn btn-primary" onClick={handleSaveGrades} disabled={saving}>
                    {saving ? "Saving..." : "Save Grades"}
                  </button>
                  <button onClick={() => setEdited({})} disabled={saving} className="btn btn-cancel">
                    Discard
                  </button>
                </div>
              )}

              {selectedStudent && userRole === "admin" && (
                <button className="btn btn-edit" onClick={toggleEditingGrades}>
                  {isEditingGrades ? "Cancel Edit" : "Edit Records"}
                </button>
              )}
          </div>

          {/* 🔹 Top Stats Cards */}
          <div className="grades-card avg">
            Average Grade <p>{subjects.filter(s => s.grade).length > 0 ? (subjects.filter(s => s.grade).reduce((sum, s) => sum + parseFloat(s.grade || 0), 0) / subjects.filter(s => s.grade).length).toFixed(2) : "0"}</p>
          </div>
          <div className="grades-card total">
            Total Subjects Taken <p>{subjects.filter(s => s.grade !== null).length}</p>
          </div>
          <div className="grades-card passed">
            Passed <p>{subjects.filter(s => s.status === "Passed").length}</p>
          </div>
          <div className="grades-card failed">
            Failed <p>{subjects.filter(s => s.status === "Failed").length}</p>
          </div>

          {/* 🔹 Graph */}
          <div className="grades-card graph">
            <h3>Grade Trend (Per Semester)</h3>
            {subjects.filter(s => s.grade).length === 0 ? <p>No Grades detected</p> : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={
                  Object.values(
                    subjects.filter(s => s.grade).reduce((acc, s) => {
                      const sem = s.semester || "?";
                      const key = `${s.year_level}-${sem}`;
                      if (!acc[key]) acc[key] = { year_level: s.year_level, semester: sem, grades: [] };
                      acc[key].grades.push(parseFloat(s.grade));
                      return acc;
                    }, {})
                  ).map(entry => ({ name: `Year ${entry.year_level} Sem ${entry.semester}`, grade: (entry.grades.reduce((a, b) => a + b, 0) / entry.grades.length).toFixed(2) }))
                }>
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[1, 5]} reversed />
                  <Tooltip />
                  <Line type="monotone" dataKey="grade" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      ) : (
        <div className="no-selection">
          <p>No student selected.</p>
        </div>
      )}
    </div>
  );

};

const ProfileField = ({ label, value, name, onChange, editable, type = "text" }) => {
  const formatValue = () => {
    if (!value) return "";
    if (type === "date") return value.split("T")[0];
    return value;
  };

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {editable ? (
        <input
          className="form-input"
          type={type}
          name={name}
          value={formatValue()}
          onChange={(e) => onChange(name, e.target.value)}
        />
      ) : (
        <div className="form-static">{formatValue() || "-"}</div>
      )}
    </div>
  );
};