import React, { useState, useEffect, useMemo } from "react";
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

  const semesters = useMemo(() => ["1st", "2nd"], []);
  const isAdmin = userRole === "admin";
  const isDisabled = !isAdmin || !isEditing;

  // Fetch subjects and programs on mount
  useEffect(() => {
    fetchSubjects();
    fetchPrograms();
  }, [fetchSubjects, fetchPrograms]);

  // Filtered subjects memoized for performance
  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      const matchesSearch =
        s.subject_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.subject_desc?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProgram = !programFilter || s.program_id === Number(programFilter);
      const matchesYear = !filterYear || s.year_level === Number(filterYear);
      return matchesSearch && matchesProgram && matchesYear;
    });
  }, [subjects, searchTerm, programFilter, filterYear]);

  // Group subjects by semester
  const subjectsBySemester = useMemo(
    () =>
      semesters.map((sem) => ({
        semester: sem,
        items: filteredSubjects.filter((s) => s.semester === sem),
      })),
    [filteredSubjects, semesters]
  );

  // Save subject changes
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

  // Delete selected subject
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

  // Add prerequisite (subject or year standing)
  const handleAddPrerequisite = (item) => {
    if (!selected) return;

    if (item.year_standing_level) {
      // Replace existing prerequisites with year standing
      setSelected({ ...selected, prerequisites: [item] });
      return;
    }

    const updatedPrereqs = (selected.prerequisites || []).filter((p) => !p.year_standing_level);

    if (updatedPrereqs.some((p) => p.code === item.subject_code)) {
      addToast("Prerequisite already added!", "warning");
      return;
    }

    const newPrereq = {
      prerequisite_id: Date.now(),
      code: item.subject_code,
      desc: item.subject_desc,
      type: "Pre",
    };

    setSelected({ ...selected, prerequisites: [...updatedPrereqs, newPrereq] });
  };

  // Remove prerequisite
  const handleRemovePrerequisite = (key) => {
    if (!selected) return;
    const updatedPrereqs = (selected.prerequisites || []).filter(
      (p) => (p.prerequisite_id ?? p.code) !== key
    );
    setSelected({ ...selected, prerequisites: updatedPrereqs });
  };

  // Render subject rows grouped by semester
  const renderSubjectRows = () =>
    subjectsBySemester.map(
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
                  {subj.prerequisites?.length
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
    );

  return (
    <div className="subjects-container">
      {/* Header controls */}
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
        {/* Subjects list */}
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
              <tbody>{renderSubjectRows()}</tbody>
            </table>
          )}
        </div>

        {/* Subject details */}
        {selected ? (
          <div className="subject-details">
            <div className="subject-details-header">
              <h3>Subject Details</h3>
            </div>

            <div className="subject-form">
              {/* Section & Code */}
              <div className="form-row two-cols">
                {["Section", "Code"].map((field, idx) => (
                  <div className="col" key={idx}>
                    <label>{field}</label>
                    <input
                      type="text"
                      value={
                        field === "Section"
                          ? selected.subject_section || ""
                          : selected.subject_code || ""
                      }
                      onChange={(e) =>
                        setSelected({
                          ...selected,
                          [field === "Section" ? "subject_section" : "subject_code"]: e.target.value,
                        })
                      }
                      disabled={isDisabled}
                    />
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="form-row full">
                <label>Description</label>
                <textarea
                  value={selected.subject_desc || ""}
                  onChange={(e) => setSelected({ ...selected, subject_desc: e.target.value })}
                  disabled={isDisabled}
                />
              </div>

              {/* Units / Lec / Lab */}
              <div className="form-row three-cols">
                {[
                  { label: "Units", key: "units", step: 0.1 },
                  { label: "Lec Hours", key: "lec_hours" },
                  { label: "Lab Hours", key: "lab_hours" },
                ].map((field) => (
                  <div className="col" key={field.key}>
                    <label>{field.label}</label>
                    <input
                      type="number"
                      step={field.step || 1}
                      value={selected[field.key] ?? 0}
                      onChange={(e) => setSelected({ ...selected, [field.key]: e.target.value })}
                      disabled={isDisabled}
                    />
                  </div>
                ))}
              </div>

              {/* Year & Semester */}
              <div className="form-row two-cols">
                <div className="col">
                  <label>Year Level</label>
                  <select
                    value={selected.year_level ?? 1}
                    onChange={(e) => setSelected({ ...selected, year_level: Number(e.target.value) })}
                    disabled={isDisabled}
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {`${n} Year`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col">
                  <label>Semester</label>
                  <select
                    value={selected.semester || "1st"}
                    onChange={(e) => setSelected({ ...selected, semester: e.target.value })}
                    disabled={isDisabled}
                  >
                    {["1st", "2nd", "Summer"].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Program */}
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

              {/* Prerequisites */}
              <div className="form-row full">
                <label>Prerequisites</label>
                <div className="prereq-controls" style={{ display: "flex", gap: "0.5rem" }}>
                  <select
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) return;

                      if (val.startsWith("YS_")) {
                        const level = Number(val.split("_")[1]);
                        handleAddPrerequisite({ year_standing_level: level });
                      } else {
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
                      if (!subjectsForYear.length) return null;
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

              {/* Edit / Save / Delete */}
              {isAdmin && (
                <button
                  className="btn btn-secondary edit-btn"
                  onClick={() => setIsEditing((prev) => !prev)}
                >
                  {isEditing ? "Cancel Edit" : "Edit Subject"}
                </button>
              )}

              {isAdmin && isEditing && (
                <div className="actions">
                  <button type="button" className="btn btn-primary" onClick={handleSave}>
                    Save
                  </button>
                  <button type="button" className="btn btn-delete" onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <h2>Please Select a Subject</h2>
        )}
      </div>
    </div>
  );
}
