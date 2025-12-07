import React, { useState, useEffect, useRef } from "react";
import { CustomSelect } from "../../components/customSelect";
import API from "../../api/api";
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
  filterSection,
  setSectionFilter,
  settings,
  tab,
  filteredStudents = [],
  handleSelectStudent,
  selectedStudent,
  programs = [],
  departments = [],
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const wrapperRef = useRef(null);
  const [maxSection, setMaxSection] = useState("A");
  const didSyncRef = useRef(false);

  const showProgramFilter = ["dashboard", "enrollment", "subjects", "students"].includes(tab);
  const showYearFilter = ["enrollment", "subjects", "students"].includes(tab);
  const showDepartmentFilter = tab === "faculty";
  const showStatusFilter = ["students", "enrollment"].includes(tab);
  const showSectionFilter = ["students", "enrollment"].includes(tab);

  const getSafeFullName = (s) =>
    `${s.first_name || ""} ${s.middle_name || ""} ${s.last_name || ""}`.trim();

  // 🔹 Sync search bar with selected student
  useEffect(() => {
    if (
      selectedStudent &&
      tab === "records" &&
      !didSyncRef.current
    ) {
      const fullName = `${selectedStudent.first_name || ""} ${selectedStudent.middle_name || ""} ${selectedStudent.last_name || ""}`.trim();
      setSearchQuery(fullName);

      // Only call handleSelectStudent if needed
      handleSelectStudent?.({ ...selectedStudent, full_name: fullName });

      didSyncRef.current = true; // mark as synced
    }
  }, [selectedStudent, tab, setSearchQuery, handleSelectStudent]);
  // Fetch max section when programFilter or filterYear changes
  useEffect(() => {
    const fetchMaxSection = async () => {
      if (!programFilter || !filterYear) {
        setMaxSection("A");
        return;
      }

      try {
        const res = await API.get(
          `/programs/departments/${programFilter}/${filterYear}/max-section`
        );
        setMaxSection(res.data.max_section || "A");

        if (filterSection && filterSection > res.data.max_section) {
          setSectionFilter("");
        }
      } catch (err) {
        console.error("Failed to fetch max section:", err);
        setMaxSection("A");
      }
    };
    fetchMaxSection();
  }, [programFilter, filterYear, filterSection, setSectionFilter]);

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
            placeholder={
              tab === "subjects" ? "Search Subject"
                : "Search by ID or Name"
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

      {/* Filters */}
      <div className="filters-wrapper flex gap-2 flex-wrap">
        {showDepartmentFilter && (
          <CustomSelect
            options={[
              { value: "", label: "All Departments" },
              ...departments.map((d) => ({ value: d.department_id, label: d.department_code })),
            ]}
            value={departmentFilter || ""}
            onChange={(val) => setDepartmentFilter(val)}
            placeholder="All Departments"
          />
        )}
        {showProgramFilter && (
          <CustomSelect
            options={[
              { value: "", label: "All Programs" },
              ...programs.map((p) => ({ value: p.program_id, label: p.program_code })),
            ]}
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
        {showSectionFilter && (
          <CustomSelect
            options={[
              { value: "", label: "All Sections" },
              ...Array.from(
                { length: maxSection.charCodeAt(0) - 64 },
                (_, i) => {
                  const val = String.fromCharCode(65 + i);
                  return { value: val, label: val };
                }
              ),
            ]}
            value={filterSection || ""}
            onChange={(val) => setSectionFilter(val)}
            placeholder="All Sections"
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
