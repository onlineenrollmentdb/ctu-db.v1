import React, { useState, useEffect, useCallback, useRef } from "react";
import API from "../../api/api";
import AdminHeaderControls from "../components/AdminHeaderControls";
import { useToast } from "../../context/ToastContext";
import { getSocket } from "../../socket";
import defaultUser from "../../img/default_user.webp";

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
  const socket = getSocket();
  const [filtered, setFiltered] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState({});
  const [saving, setSaving] = useState(false);
  const [isEditingGrades, setIsEditingGrades] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [studentForm, setStudentForm] = useState({});

  const inputRef = useRef(null);
  const searchWrapperRef = useRef(null);
  const { addToast } = useToast();

  const toggleEditingGrades = () => {
    if (isEditingGrades) setEdited({});
    setIsEditingGrades(prev => !prev);
  };

  const toggleEditingDetails = () => {
    if (isEditingDetails && selectedStudent) setStudentForm({ ...selectedStudent });
    setIsEditingDetails(prev => !prev);
  };

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

  const getSafeFullName = s =>
    `${s.first_name || ""} ${s.middle_name || ""} ${s.last_name || ""}`.replace(/\s+/g, ' ').trim();

  const handleSelectStudent = useCallback(
    async student => {
      try {
        setLoading(true);
        const res = await API.get(`/students/${student.student_id}`);
        const fullStudent = res.data;
        setSelectedStudent(fullStudent);
        setStudentForm(fullStudent);
        setFiltered([]);
        setSearchQuery(getSafeFullName(fullStudent));
        if (inputRef.current) inputRef.current.blur();
        await fetchSubjects(fullStudent.student_id);
      } catch (err) {
        console.error(err);
        addToast("Failed to load student details ❌", "error");
      } finally {
        setLoading(false);
      }
    },
    [setSelectedStudent, setSearchQuery, fetchSubjects, addToast]
  );

  useEffect(() => {
    if (initialSearch?.student_id) {
      setSearchQuery(initialSearch.full_name);
      handleSelectStudent(initialSearch);
    }
  }, [initialSearch, handleSelectStudent, setSearchQuery]);

  useEffect(() => {
    if (!searchQuery) return setFiltered([]);
    const term = searchQuery.toLowerCase();
    const matches = students.filter(
      s =>
        s.student_id.toString().includes(term) ||
        [s.first_name, s.middle_name, s.last_name, s.full_name]
          .some(name => name?.toLowerCase().includes(term))
    );
    setFiltered(matches.slice(0, 5));
  }, [searchQuery, students]);

  useEffect(() => {
    if (selectedStudent) fetchSubjects(selectedStudent.student_id);
  }, [selectedStudent, fetchSubjects]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setFiltered([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const computeStatusPreview = (gradeVal, originalStatus) => {
    if (gradeVal === "" || gradeVal === null || gradeVal === undefined) return originalStatus ?? "";
    const n = parseFloat(gradeVal);
    if (isNaN(n)) return originalStatus ?? "";
    if (n === 0) return "INC";
    return n <= 3.0 ? "Passed" : "Failed";
  };

  const handleGradeChange = (subject_section, field, value) => {
    setEdited(prev => ({ ...prev, [subject_section]: { ...prev[subject_section], [field]: value } }));
  };

  const hasEdits = Object.keys(edited).length > 0;

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

      socket.emit("studentUpdated", {
        student_id: selectedStudent.student_id,
        student_status: res.data?.student_status,
      });

      addToast("Grades updated successfully 🎓", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to save grades", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDetails = async () => {
    if (!selectedStudent) return;
    setSaving(true);
    try {
      await API.put(`/students/${selectedStudent.student_id}`, studentForm);
      setSelectedStudent(prev => prev ? { ...prev, ...studentForm } : prev);
      setIsEditingDetails(false);
      addToast("Student details updated 🧾", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to update student details", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDetailChange = (field, value) => setStudentForm(prev => ({ ...prev, [field]: value }));

  const serverURL = process.env.REACT_APP_SOCKET;
  const profilePicture = studentForm.profile_picture ? `${serverURL}${studentForm.profile_picture}` : defaultUser;

  return (
    <div className="flex flex-col gap-6">
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
      />

      {selectedStudent ? (
        <div className="flex flex-col gap-6">
          {/* Student Details */}
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row gap-6">
            {/* Profile Picture */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <img
                src={profilePicture}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border border-gray-200"
              />
              {isEditingDetails && (
                <label className="absolute inset-0 bg-black bg-opacity-30 text-white flex flex-col justify-center items-center rounded-full cursor-pointer">
                  Change Profile
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => handleDetailChange("profile_picture", e.target.files[0])}
                  />
                </label>
              )}
            </div>

            {/* Student Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
              {[
                ["First Name", "first_name"], ["Middle Name", "middle_name"], ["Last Name", "last_name"],
                ["Contact Number", "contact_number"], ["Student ID", "student_id"], ["Permanent Address", "permanent_address"],
                ["District", "congressional_district"], ["Gender", "gender"], ["Region", "region"],
                ["Email", "email"], ["Course", "program_code"], ["Civil Status", "civil_status"],
                ["Year & Section", "year_section"], ["Citizenship", "citizenship"], ["Birthday", "birth_date"],
                ["Birth Place", "birthplace"], ["Religion", "religion"], ["Status", "student_status"],
                ["Father's Name", "father_name"], ["Mother's Name", "mother_name"],
                ["Father's Occupation", "father_occupation"], ["Mother's Occupation", "mother_occupation"],
                ["Guardian's Name", "guardian_name"], ["Guardian Relation", "guardian_relationship"],
                ["Guardian Contact", "guardian_contact"], ["Enrollment Status", "is_enrolled"]
              ].map(([label, field]) => (
                <ProfileField
                  key={field}
                  label={label}
                  name={field}
                  value={
                    field === "program_code" ? `${studentForm.program_code} - ${studentForm.program_name}`
                      : field === "year_section" ? `${studentForm.year_level} - ${studentForm.section}`
                      : field === "is_enrolled" ? studentForm.is_enrolled === 1 ? "Enrolled" : "Not Enrolled"
                      : studentForm[field]
                  }
                  editable={isEditingDetails && !["student_id","program_code","year_section","student_status","is_enrolled"].includes(field)}
                  onChange={handleDetailChange}
                  type={field === "birth_date" ? "date" : "text"}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          {userRole === "admin" && (
            <div className="flex gap-2">
              {isEditingDetails ? (
                <>
                  <button
                    onClick={handleSaveDetails}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => { setIsEditingDetails(false); setStudentForm({ ...selectedStudent }); }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={toggleEditingDetails}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Edit Details
                </button>
              )}
            </div>
          )}

          {/* Subject Records */}
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Subject Records</h3>
              {userRole === "admin" && (
                <button
                  onClick={toggleEditingGrades}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                >
                  {isEditingGrades ? "Cancel Edit" : "Edit Records"}
                </button>
              )}
            </div>

            {loading ? (
              <p>Loading subjects...</p>
            ) : (
              <>
                {isEditingGrades && hasEdits && (
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={handleSaveGrades}
                      disabled={saving}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                    >
                      {saving ? "Saving..." : "Save Grades"}
                    </button>
                    <button
                      onClick={() => setEdited({})}
                      disabled={saving}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm"
                    >
                      Discard
                    </button>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Year Group</th>
                        <th className="p-2 text-left">Section</th>
                        <th className="p-2 text-left">Code</th>
                        <th className="p-2 text-left">Description</th>
                        <th className="p-2 text-left">Units</th>
                        <th className="p-2 text-left">Grade</th>
                        <th className="p-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries([...subjects].reduce((groups, subj) => {
                        const key = `Year ${subj.year_level} - ${subj.semester === 1 ? "1st" : subj.semester === 2 ? "2nd" : subj.semester} Semester`;
                        if (!groups[key]) groups[key] = [];
                        groups[key].push(subj);
                        return groups;
                      }, {})).map(([group, records], idx) => {
                        const sortedRecords = records.sort((a, b) => a.subject_code.localeCompare(b.subject_code));
                        return (
                          <React.Fragment key={group}>
                            {idx > 0 && <tr><td colSpan={7} className="py-2"></td></tr>}
                            {sortedRecords.map((s, i) => {
                              const editedRec = edited[s.subject_section];
                              const gradeValue = editedRec ? editedRec.grade : s.grade ?? "";
                              const statusPreview = computeStatusPreview(editedRec?.grade ?? s.grade, s.status);

                              return (
                                <tr key={`${group}-${i}`} className="hover:bg-gray-50">
                                  {i === 0 && <td rowSpan={sortedRecords.length} className="p-2 font-semibold">{group}</td>}
                                  <td className="p-2">{s.subject_section}</td>
                                  <td className="p-2">{s.subject_code}</td>
                                  <td className="p-2">{s.subject_desc || "—"}</td>
                                  <td className="p-2">{s.units || "—"}</td>
                                  <td className="p-2">
                                    {isEditingGrades ? (
                                      <input
                                        type="text"
                                        value={gradeValue ?? ""}
                                        onChange={e => handleGradeChange(s.subject_section, "grade", e.target.value)}
                                        className="w-16 text-center border border-gray-300 rounded px-1 py-0.5 text-sm"
                                      />
                                    ) : gradeValue ?? "-"}
                                  </td>
                                  <td className="p-2">{statusPreview ?? ""}</td>
                                </tr>
                              );
                            })}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">No student selected.</div>
      )}
    </div>
  );
}

const ProfileField = ({ label, value, name, onChange, editable, type = "text" }) => {
  const formatValue = () => (type === "date" && value ? value.split("T")[0] : value || "");
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {editable ? (
        <input
          type={type}
          name={name}
          value={formatValue()}
          onChange={e => onChange(name, e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      ) : (
        <div className="text-gray-600 text-sm">{formatValue() || "-"}</div>
      )}
    </div>
  );
};
