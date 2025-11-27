import React, { useState, useEffect } from "react";
import API from "../../api/api";
import AdminHeaderControls from "../components/AdminHeaderControls";
import { useToast } from "../../context/ToastContext";

export default function SubjectsTab({
  settings,
  subjects,
  setSubjects,
  fetchSubjects,
  programs,
  setPrograms,
  fetchPrograms,
  filterYear,
  setYearFilter,
  loading,
  userRole,
}) {
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchSubjects();
    fetchPrograms();
  }, [fetchSubjects, fetchPrograms]);

  const handleSave = async () => {
    if (!selected) return;
    try {
      await API.put(`/subjects/${selected.subject_id}`, selected);
      addToast("Subject updated!", "success");
      fetchSubjects();
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving subject:", err);
      addToast("Failed to save subject", "error");
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await API.delete(`/subjects/${selected.subject_id}`);
      addToast("Subject deleted!", "success");
      setSelected(null);
      fetchSubjects();
    } catch (err) {
      console.error("Error deleting subject:", err);
      addToast("Failed to delete subject", "error");
    }
  };

  const handleAddPrerequisite = (subjectOrYearStanding) => {
    if (!selected) return;

    // Year standing selected
    if (subjectOrYearStanding.year_standing_level) {
      const newPrereq = subjectOrYearStanding;
      // Replace any previous prerequisites with Year Standing
      setSelected({ ...selected, prerequisites: [newPrereq] });
      return;
    }

    // Subject prerequisite
    const subj = subjectOrYearStanding;

    // Remove Year Standing if already exists
    const updatedPrereqs = (selected.prerequisites || []).filter(
      (p) => !p.year_standing_level
    );

    if (updatedPrereqs.some((p) => p.code === subj.subject_code)) {
      addToast("Prerequisite already added!", "warning");
      return;
    }

    const newPrereq = {
      prerequisite_id: Date.now(),
      code: subj.subject_code,
      desc: subj.subject_desc,
      type: "Pre",
    };

    setSelected({
      ...selected,
      prerequisites: [...updatedPrereqs, newPrereq],
    });
  };

  const handleRemovePrerequisite = (key) => {
    if (!selected) return;
    const updatedPrereqs = (selected.prerequisites || []).filter(
      (p) => (p.prerequisite_id ?? p.code) !== key
    );
    setSelected({ ...selected, prerequisites: updatedPrereqs });
  };

  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch =
      s.subject_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.subject_desc?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = !programFilter || s.program_id === Number(programFilter);
    const matchesYear = !filterYear || s.year_level === Number(filterYear);
    return matchesSearch && matchesProgram && matchesYear;
  });

  const semesters = ["1st", "2nd", "Summer"];
  const subjectsBySemester = semesters.map((sem) => ({
    semester: sem,
    items: filteredSubjects.filter((s) => s.semester === sem),
  }));

  const isDisabled = userRole !== "admin" || !isEditing;

  return (
    <div className="subjects-container">
      <AdminHeaderControls
        searchQuery={searchTerm}
        setSearchQuery={setSearchTerm}
        programs={programs}
        programFilter={programFilter}
        setProgramFilter={setProgramFilter}
        settings={settings}
        tab="subjects"
        filterYear={filterYear}
        setYearFilter={setYearFilter}
      />

      <div className="subjects-wrapper">
        {/* Subjects List */}
        <div className="subjects-list">
          <h3>Subjects</h3>
          {loading ? (
            <p>Loading subjects...</p>
          ) : filteredSubjects.length === 0 ? (
            <p>No subjects found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Title</th>
                  <th>Prerequisites</th>
                  <th>Units</th>
                  <th>Lec</th>
                  <th>Lab</th>
                </tr>
              </thead>
              <tbody>
                {subjectsBySemester.map(
                  (group) =>
                    group.items.length > 0 && (
                      <React.Fragment key={group.semester}>
                        <tr className="semester-divider">
                          <td colSpan="6">{group.semester} Semester</td>
                        </tr>
                        {group.items.map((subj) => (
                          <tr
                            key={subj.subject_id}
                            className={selected?.subject_id === subj.subject_id ? "selected" : ""}
                            onClick={() => setSelected(subj)}
                          >
                            <td>{subj.subject_code}</td>
                            <td>{subj.subject_desc}</td>
                            <td>
                              {subj.prerequisites?.length > 0
                                ? subj.prerequisites.map((p) => p.code).join(", ")
                                : "None"}
                            </td>
                            <td>{subj.units}</td>
                            <td>{subj.lec_hours}</td>
                            <td>{subj.lab_hours}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    )
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Subject Details */}
        {selected && (
          <div className="subject-details">
            <div className="subject-details-header">
              <h3>Subject Details</h3>
            </div>

            <div className="subject-form">
              {/* Fields look the same, but disabled if not editing */}
              <div className="form-row two-cols">
                <div className="col">
                  <label>Section</label>
                  <input
                    type="text"
                    value={selected.subject_section || ""}
                    onChange={(e) => setSelected({ ...selected, subject_section: e.target.value })}
                    disabled={isDisabled}
                  />
                </div>
                <div className="col">
                  <label>Code</label>
                  <input
                    type="text"
                    value={selected.subject_code || ""}
                    onChange={(e) => setSelected({ ...selected, subject_code: e.target.value })}
                    disabled={isDisabled}
                  />
                </div>
              </div>

              <div className="form-row full">
                <label>Description</label>
                <textarea
                  value={selected.subject_desc || ""}
                  onChange={(e) => setSelected({ ...selected, subject_desc: e.target.value })}
                  disabled={isDisabled}
                />
              </div>

              <div className="form-row three-cols">
                <div className="col">
                  <label>Units</label>
                  <input
                    type="number"
                    step="0.1"
                    value={selected.units ?? 0}
                    onChange={(e) => setSelected({ ...selected, units: e.target.value })}
                    disabled={isDisabled}
                  />
                </div>
                <div className="col">
                  <label>Lec Hours</label>
                  <input
                    type="number"
                    value={selected.lec_hours ?? 0}
                    onChange={(e) => setSelected({ ...selected, lec_hours: e.target.value })}
                    disabled={isDisabled}
                  />
                </div>
                <div className="col">
                  <label>Lab Hours</label>
                  <input
                    type="number"
                    value={selected.lab_hours ?? 0}
                    onChange={(e) => setSelected({ ...selected, lab_hours: e.target.value })}
                    disabled={isDisabled}
                  />
                </div>
              </div>

              <div className="form-row two-cols">
                <div className="col">
                  <label>Year Level</label>
                  <select
                    value={selected.year_level ?? 1}
                    onChange={(e) => setSelected({ ...selected, year_level: Number(e.target.value) })}
                    disabled={isDisabled}
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                  </select>
                </div>
                <div className="col">
                  <label>Semester</label>
                  <select
                    value={selected.semester || "1st"}
                    onChange={(e) => setSelected({ ...selected, semester: e.target.value })}
                    disabled={isDisabled}
                  >
                    <option value="1st">1st</option>
                    <option value="2nd">2nd</option>
                    <option value="Summer">Summer</option>
                  </select>
                </div>
              </div>

              <div className="form-row full">
                <label>Program</label>
                <select
                  value={selected.program_id ?? ""}
                  onChange={(e) => setSelected({ ...selected, program_id: Number(e.target.value) })}
                  disabled={isDisabled}
                >
                  <option value="">-- Select Program --</option>
                  {programs.map((p) => (
                    <option key={p.program_id} value={p.program_id}>
                      {p.program_code ? `${p.program_code} – ${p.program_name}` : p.program_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row full">
                <label>Prerequisites</label>
                <div className="prereq-controls" style={{ display: "flex", gap: "0.5rem" }}>
                <select
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) return;

                    if (val.startsWith("YS_")) {
                      // Year Standing
                      const level = Number(val.split("_")[1]);
                      handleAddPrerequisite({ year_standing_level: level });
                    } else {
                      // Subject prerequisite
                      const subj = subjects.find((s) => s.subject_code === val);
                      if (subj) handleAddPrerequisite(subj);
                    }

                    e.target.value = "";
                  }}
                  disabled={isDisabled}
                >
                  <option value="">-- Select a prerequisite --</option>

                  {[1, 2, 3, 4].map((num) => {
                    const subjectsForYear = subjects.filter((s) => s.year_level === num);
                    if (subjectsForYear.length === 0) return null;

                    return (
                      <React.Fragment key={num}>
                        <option value={`YS_${num}`} style={{ fontWeight: "bold" }}>
                          {["1st", "2nd", "3rd", "4th"][num - 1]} Year Standing
                        </option>
                        {subjectsForYear.map((s) => (
                          <option key={s.subject_id} value={s.subject_code}>
                            &nbsp;&nbsp;{s.subject_code} — {s.subject_desc} ({s.semester} Sem)
                          </option>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </select>
                </div>

                <div className="prereq-list">
                  {(selected.prerequisites || []).map((p) => (
                    <div key={p.prerequisite_id ?? p.code} className="prereq-chip">
                      <div>
                        <strong>
                          {p.year_standing_level
                            ? `${["1st", "2nd", "3rd", "4th"][p.year_standing_level - 1]} Year Standing`
                            : p.code}
                        </strong>
                      </div>
                      {isEditing && (
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => handleRemovePrerequisite(p.prerequisite_id ?? p.code)}
                          disabled={isDisabled}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {userRole === "admin" && (
                <button
                  className="btn btn-secondary edit-btn"
                  onClick={() => setIsEditing((prev) => !prev)}
                >
                  {isEditing ? "Cancel Edit" : "Edit Subject"}
                </button>
              )}

              {userRole === "admin" && isEditing && (
                <div className="actions">
                  <button type="button" className="btn btn-primary" onClick={handleSave}>
                    Save
                  </button>
                  <button type="button" className="btn btn-danger" onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
