import React, { useState, useEffect, useRef } from "react";
import { CustomSelect } from "../../components/customSelect";
import "../css/header.css";

export const AdminHeaderControls = ({
  searchQuery,
  setSearchQuery,
  departmentFilter,
  setDepartmentFilter,
  programFilter,
  setProgramFilter,
  statusFilter,
  setStatusFilter,
  filterYear,
  setYearFilter,
  settings,
  tab,
  filteredStudents = [],
  handleSelectStudent,
  programs = [],
  departments = [],
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const wrapperRef = useRef(null);

  const showProgramFilter = ["dashboard", "enrollment", "subjects", "students"].includes(tab);
  const showYearFilter = ["enrollment", "subjects", "students"].includes(tab);
  const showDepartmentFilter = tab === "faculty";
  const showStatusFilter = ["students", "enrollment"].includes(tab);

  const getSafeFullName = (s) =>
    `${s.first_name || ""} ${s.middle_name || ""} ${s.last_name || ""}`.trim();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleYearChange = (value) => {
    setYearFilter(value ? Number(value) : "");
  };

  return (
    <div className="admin-header-controls flex flex-wrap gap-2 items-center">
      {/* Academic Year & Semester */}
      <div className="semester-year">
        <span>
          <strong>Academic Year:</strong> {settings?.current_academic_year || "N/A"} |
          <strong> Semester:</strong> {settings?.current_semester || "N/A"}
        </span>
      </div>

      {/* Search Bar */}
      <div className="search-bar-wrapper" ref={wrapperRef}>
        <div className="search-bar">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            placeholder={tab === "records" ? "Search by ID or Name" : "Search by ID, Name, or Subject"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {tab === "records" && isDropdownOpen && (
          <ul className="search-dropdown-overlay">
            {filteredStudents
              .filter((s, index, self) => index === self.findIndex((stu) => stu.student_id === s.student_id))
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

      {/* Filters */}
      <div className="filters-wrapper flex gap-2 flex-wrap">
        {showDepartmentFilter && (
          <CustomSelect
            options={[{ value: "", label: "All Departments" }, ...departments.map(d => ({ value: d.department_id, label: d.department_code }))]}
            value={departmentFilter || ""}
            onChange={(val) => setDepartmentFilter(val)}
            placeholder="All Departments"
          />
        )}
        {showProgramFilter && (
          <CustomSelect
            options={[{ value: "", label: "All Programs" }, ...programs.map(p => ({ value: p.program_id, label: p.program_code }))]}
            value={programFilter || ""}
            onChange={(val) => setProgramFilter(val ? Number(val) : "")}
            placeholder="All Programs"
          />
        )}
        {showYearFilter && (
          <CustomSelect
            options={[
              { value: "", label: "All Years" },
              ...[1, 2, 3, 4].map((y) => {
                const suffix = y === 1 ? "st" : y === 2 ? "nd" : y === 3 ? "rd" : "th";
                return { value: y, label: `${y}${suffix} Year` };
              }),
            ]}
            value={filterYear || ""}
            onChange={handleYearChange}
            placeholder="All Years"
          />
        )}

        {showStatusFilter && (
          <CustomSelect
            options={[
              { value: "", label: "All Status" },
              { value: "Regular", label: "Regular" },
              { value: "Irregular", label: "Irregular" },
            ]}
            value={statusFilter || ""}
            onChange={(val) => setStatusFilter(val)}
            placeholder="All Status"
          />
        )}
      </div>
    </div>
  );
};

export default AdminHeaderControls;
