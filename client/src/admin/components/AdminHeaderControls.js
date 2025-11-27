import React, { useState, useRef, useEffect } from "react";
import "../css/header.css";

const AdminHeaderControls = ({
  searchQuery,
  setSearchQuery,
  departmentFilter,
  setDepartmentFilter,
  programFilter,
  setProgramFilter,
  filterYear,
  setYearFilter,
  settings,
  tab, // "records" | "enrollment" | "dashboard" | "subjects" | "settings" | "faculty" | "students"
  filteredStudents = [], // only for Records tab
  handleSelectStudent, // callback when selecting student
  programs = [], // dynamic programs
  departments = [], // dynamic departments for FacultyTab
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const wrapperRef = useRef(null);

  const showProgramFilter = ["dashboard", "enrollment", "subjects", "students"].includes(tab);
  const showYearFilter = ["enrollment", "subjects", "students"].includes(tab);
  const showDepartmentFilter = tab === "faculty";

  const getSafeFullName = (s) =>
    `${s.first_name || ""} ${s.middle_name || ""} ${s.last_name || ""}`.trim();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open dropdown for records tab
  useEffect(() => {
    if (tab === "records" && filteredStudents.length > 0) {
      setIsDropdownOpen(true);
      setHighlightIndex(0);
    } else {
      setIsDropdownOpen(false);
    }
  }, [filteredStudents, tab]);

  const handleKeyDown = (e) => {
    if (!isDropdownOpen) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) => (prev + 1) % filteredStudents.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev === 0 ? filteredStudents.length - 1 : prev - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        const student = filteredStudents[highlightIndex];
        if (student && handleSelectStudent) {
          const fullName = getSafeFullName(student);
          handleSelectStudent({ ...student, full_name: fullName });
          setSearchQuery(fullName);
          setIsDropdownOpen(false);
        }
        break;
      case "Escape":
        setIsDropdownOpen(false);
        break;
      default:
        break;
    }
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    setYearFilter(value ? Number(value) : "");
  };

  return (
    <div className="admin-header-controls">
      {tab === "settings" ? (
        <>
          <div className="settings-title">
            <h2>Academic Settings</h2>
          </div>
          <div className="semester-year">
            <p>
              <strong>Semester:</strong> {settings?.current_semester || "N/A"}
            </p>
            <p>
              <strong>School Year:</strong> {settings?.current_academic_year || "N/A"}
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Search Bar */}
          <div className="search-bar-wrapper" ref={wrapperRef}>
            <div className="search-bar">
              <i className="bi bi-search search-icon"></i>
              <input
                type="text"
                placeholder={
                  tab === "records"
                    ? "Search by ID or Name"
                    : "Search by ID, Name, or Subject"
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            {tab === "records" && isDropdownOpen && (
              <ul className="search-dropdown-overlay">
                {filteredStudents
                  .filter(
                    (s, index, self) =>
                      index === self.findIndex((stu) => stu.student_id === s.student_id)
                  )
                  .map((s, idx) => {
                    const fullName = getSafeFullName(s);
                    return (
                      <li
                        key={s.student_id}
                        className={highlightIndex === idx ? "highlighted" : ""}
                        onClick={() => {
                          handleSelectStudent({ ...s, full_name: fullName });
                          setSearchQuery(fullName);
                          setIsDropdownOpen(false);
                        }}
                        onMouseEnter={() => setHighlightIndex(idx)}
                      >
                        {s.student_id} - {fullName}
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>

          {/* Department Filter */}
          {showDepartmentFilter && (
            <div className="filter">
              <select
                value={departmentFilter || ""}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d.department_id} value={d.department_id}>
                    {d.department_code}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Program Filter (type-safe) */}
          {showProgramFilter && (
            <div className="filter">
              <select
                value={programFilter || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setProgramFilter(val !== "" ? Number(val) : "");
                }}
              >
                <option value="">All Programs</option>
                {programs.map((p) => (
                  <option key={p.program_id} value={p.program_id}>
                    {p.program_code}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Year Filter */}
          {showYearFilter && (
            <div className="filter">
              <select value={filterYear || ""} onChange={handleYearChange}>
                <option value="">All Years</option>
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
            </div>
          )}

          <div className="semester-year">
            <p>
              <strong>Semester:</strong> {settings?.current_semester || "N/A"}
            </p>
            <p>
              <strong>School Year:</strong> {settings?.current_academic_year || "N/A"}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminHeaderControls;
