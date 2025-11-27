import React, { useMemo, useState, useEffect } from "react";
import API from "../../api/api";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

import { useToast } from "../../context/ToastContext";
import socket from "../../socket";

export default function DashboardTab({ students, setStudents, setActiveTab, onViewDetails, settings }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOptionsOpen, setSortOptionsOpen] = useState(false);
  const [sortField, setSortField] = useState("first_name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterBy, setFilterBy] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // ✅ FIX: Add missing states
  const [currentSemester, setCurrentSemester] = useState("");
  const [enrollmentStatus, setEnrollmentStatus] = useState("");
  const [activeDates, setActiveDates] = useState([]);
  const [enrollmentMessage, setEnrollmentMessage] = useState("");

  // ❌ Remove highlightDates — you used activeDates instead
  // const [highlightDates, setHighlightDates] = useState([]);

  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const { addToast } = useToast();
  const studentsPerPage = 10;

  const normalizeDate = (d) => {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const isWithin = (date, start, end) => {
    const d = normalizeDate(date);
    const s = normalizeDate(start);
    const e = normalizeDate(end);
    return d >= s && d <= e;
  };

  // 🔹 Filtering
  const filteredStudents = students.filter((s) => {
    const fullName = `${s.last_name} ${s.first_name} ${s.middle_name || ""}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      s.student_id.toString().includes(searchQuery);

    let matchesFilter = true;
    if (filterBy === "cleared") matchesFilter = s.enrollment_status === 1;
    else if (filterBy === "notCleared") matchesFilter = s.enrollment_status === 0;
    else if (filterBy === "approved") matchesFilter = s.is_approved === 1;
    else if (filterBy === "notApproved") matchesFilter = s.is_approved === 0;

    let matchesStatus = true;
    if (statusFilter === "regular") matchesStatus = s.student_status === "Regular";
    else if (statusFilter === "irregular") matchesStatus = s.student_status === "Irregular";

    return matchesSearch && matchesFilter && matchesStatus;
  });

  // 🔹 Sorting
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredStudents, sortField, sortDirection]);

  // 🔹 Pagination
  const totalPages = Math.ceil(sortedStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const paginatedStudents = sortedStudents.slice(startIndex, startIndex + studentsPerPage);

  // 🔹 Stats
  const totalStudents = students.length;
  const clearedStudents = students.filter((s) => s.enrollment_status === 1).length;
  const approvedStudents = students.filter((s) => s.is_approved === 1).length;
  const enrolledStudents = students.filter((s) => s.is_enrolled === 1).length;
  const regularStudents = students.filter((s) => s.student_status === "Regular").length;
  const irregularStudents = students.filter((s) => s.student_status === "Irregular").length;

  const yearData = useMemo(() => {
    const levels = [1, 2, 3, 4];
    return levels.map((lvl) => ({
      year: `${lvl} Year`,
      count: students.filter((s) => s.year_level === lvl).length,
    }));
  }, [students]);

  useEffect(() => {
    if (!settings) return;

    const now = new Date();

    const firstSemStart = normalizeDate(settings.first_sem_start);
    const firstSemEnd = normalizeDate(settings.first_sem_end);
    const secondSemStart = normalizeDate(settings.second_sem_start);
    const secondSemEnd = normalizeDate(settings.second_sem_end);

    const firstEnrollStart = normalizeDate(settings.first_sem_enrollment_start);
    const firstEnrollEnd = normalizeDate(settings.first_sem_enrollment_end);
    const secondEnrollStart = normalizeDate(settings.second_sem_enrollment_start);
    const secondEnrollEnd = normalizeDate(settings.second_sem_enrollment_end);

    // -------------------------------
    // 📌 Highlight all enrollment days
    // -------------------------------
    const getDatesBetween = (start, end) => {
      const arr = [];
      let d = new Date(start);
      while (d <= end) {
        arr.push(new Date(d));
        d.setDate(d.getDate() + 1);
      }
      return arr;
    };

    const highlightDates = [
      ...getDatesBetween(firstEnrollStart, firstEnrollEnd),
      ...getDatesBetween(secondEnrollStart, secondEnrollEnd),
    ];
    setActiveDates(highlightDates);

    // -------------------------------
    // 📌 Determine Current Semester
    // -------------------------------
    if (isWithin(now, firstSemStart, firstSemEnd)) setCurrentSemester("1st Semester");
    else if (isWithin(now, secondSemStart, secondSemEnd)) setCurrentSemester("2nd Semester");
    else setCurrentSemester("Outside Semester");

    // -------------------------------
    // 📌 Upcoming checker (within 30 days)
    // -------------------------------
    const isUpcoming = (start) => {
      const diff = (start - now) / (1000 * 60 * 60 * 24);
      return diff > 0 && diff <= 30;
    };

    // -------------------------------
    // 📌 Enrollment States + Announcement
    // -------------------------------
    let message = "";

    if (isWithin(now, firstEnrollStart, firstEnrollEnd)) {
      setEnrollmentStatus("ongoing");
      message = "Enrollment for 1st Semester is now OPEN!";
    } else if (isUpcoming(firstEnrollStart)) {
      setEnrollmentStatus("upcoming");
      message = "Enrollment for 1st Semester is coming soon!";
    } else if (isWithin(now, secondEnrollStart, secondEnrollEnd)) {
      setEnrollmentStatus("ongoing");
      message = "Enrollment for 2nd Semester is now OPEN!";
    } else if (isUpcoming(secondEnrollStart)) {
      setEnrollmentStatus("upcoming");
      message = "Enrollment for 2nd Semester is coming soon!";
    } else {
      setEnrollmentStatus("closed");
      message = "Enrollment is currently CLOSED";
    }

    setEnrollmentMessage(message);
  }, [settings]);


  // 🔹 Academic calendar bounds
  const academicStart = new Date(settings?.first_sem_start);
  const academicEnd = new Date(settings?.summer_end);

  // 🔹 Socket updates
  useEffect(() => {
    socket.on("studentUpdated", (updated) => {
      setStudents((prev) =>
        prev.map((s) => (s.student_id === updated.student_id ? { ...s, ...updated } : s))
      );
    });
    return () => socket.off("studentUpdated");
  }, [setStudents]);

  // Reset page when sorting/filtering/searching
  useEffect(() => setCurrentPage(1), [sortField, sortDirection, filterBy, statusFilter, searchQuery]);

  const handleViewDetails = (student) => {
    onViewDetails(student);
    setActiveTab("records");
  };

  const handleClearance = async (student_id) => {
    try {
      await API.put("clearance/update", {
        student_id,
        is_cleared: true,
        academic_year: settings.current_academic_year,
        semester: settings.current_semester,
      });

      setStudents((prev) =>
        prev.map((s) => (s.student_id === student_id ? { ...s, enrollment_status: 1 } : s))
      );

      socket.emit("studentUpdated", { student_id, enrollment_status: 1 });
      addToast("Student clearance updated", "success");
    } catch {
      addToast("Failed to update clearance", "error");
    }
  };

  const handleRevokeClearance = async (student_id) => {
    try {
      await API.put("clearance/update", {
        student_id,
        is_cleared: false,
        academic_year: settings.current_academic_year,
        semester: settings.current_semester,
      });

      setStudents((prev) =>
        prev.map((s) => (s.student_id === student_id ? { ...s, enrollment_status: 0 } : s))
      );

      socket.emit("studentUpdated", { student_id, enrollment_status: 0 });
      addToast("Clearance revoked", "warning");
    } catch {
      addToast("Failed to revoke clearance", "error");
    }
  };
  const handleSortClick = (field) => {
    if (sortField === field)
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    else { setSortField(field);
      setSortDirection("asc"); } setCurrentPage(1);
  };
  return (
    <div className="dashboard mt-4">

      {/* Summary Cards */}
      <div className="dashboard-cards">
        <div className="dashboard-card"><h3>Total Students</h3><p>{totalStudents}</p></div>
        <div className="dashboard-card"><h3>Regular</h3><p>{regularStudents}</p></div>
        <div className="dashboard-card"><h3>Irregular</h3><p>{irregularStudents}</p></div>
        <div className="dashboard-card"><h3>Cleared</h3><p>{clearedStudents}</p></div>
        <div className="dashboard-card"><h3>Approved</h3><p>{approvedStudents}</p></div>
        <div className="dashboard-card"><h3>Enrolled</h3><p>{enrolledStudents}</p></div>
      </div>

      {/* Analytics */}
      <div className="dashboard-analytics">
        <div className="dashboard-section">
          <h3>Students by Year</h3>
          <BarChart width={500} height={300} data={yearData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="var(--primary-color)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </div>

        {/* Calendar */}
        <div className="dashboard-section">
          <h3>Enrollment Calendar</h3>

          <p style={{ textAlign: "center", fontWeight: "bold", marginBottom: 5 }}>
            {currentSemester}
          </p>

          <Calendar
            className="dashboard-calendar"
            value={calendarMonth}
            onChange={() => {}}
            activeStartDate={calendarMonth}
            showNavigation={true}
            next2Label={null}
            prev2Label={null}
            navigationLabel={({ label }) => <span>{label}</span>}
            onActiveStartDateChange={({ activeStartDate }) => {
              if (activeStartDate < academicStart) setCalendarMonth(academicStart);
              else if (activeStartDate > academicEnd) setCalendarMonth(academicEnd);
              else setCalendarMonth(activeStartDate);
            }}
            tileClassName={({ date, view }) =>
              view === "month" &&
              activeDates.some((d) => d.toDateString() === date.toDateString())
                ? "highlighted-date"
                : null
            }
          />

          <p
            style={{
              textAlign: "center",
              fontWeight: 600,
              marginTop: 10,
              color:
                enrollmentStatus === "ongoing"
                  ? "green"
                  : enrollmentStatus === "upcoming"
                  ? "orange"
                  : "red",
            }}
          >
            {enrollmentMessage}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="dashboard-section">
        <div className="table-header">
          <h3>Students List</h3>
          <div className="search-bar">
            <i className="bi bi-search"></i>
            <input
              id="studentSearch"
              name="studentSearch"
              placeholder="Search by ID or Name"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

      <table className="students-table">
        <thead>
          <tr>
            <th
              onClick={() => handleSortClick("student_id")}
              style={{ cursor: "pointer" }}
            >
              Student ID{" "}
              {sortField === "student_id" && (
                <i
                  className={`bi ${
                    sortDirection === "asc"
                      ? "bi-caret-up-fill"
                      : "bi-caret-down-fill"
                  }`}
                ></i>
              )}
            </th>

            <th
              onClick={() => handleSortClick("last_name")}
              style={{ cursor: "pointer" }}
            >
              Last Name{" "}
              {sortField === "last_name" && (
                <i
                  className={`bi ${
                    sortDirection === "asc"
                      ? "bi-caret-up-fill"
                      : "bi-caret-down-fill"
                  }`}
                ></i>
              )}
            </th>

            <th
              onClick={() => handleSortClick("first_name")}
              style={{ cursor: "pointer" }}
            >
              First Name{" "}
              {sortField === "first_name" && (
                <i
                  className={`bi ${
                    sortDirection === "asc"
                      ? "bi-caret-up-fill"
                      : "bi-caret-down-fill"
                  }`}
                ></i>
              )}
            </th>

            <th
              onClick={() => handleSortClick("year_level")}
              style={{ cursor: "pointer" }}
            >
              Year{" "}
              {sortField === "year_level" && (
                <i
                  className={`bi ${
                    sortDirection === "asc"
                      ? "bi-caret-up-fill"
                      : "bi-caret-down-fill"
                  }`}
                ></i>
              )}
            </th>
            <th>Status</th>
            <th
              className="sort-container"
              onClick={(e) => {
                e.stopPropagation();
                setSortOptionsOpen((prev) => !prev);
              }}
            >
              Sort <i className="bi bi-caret-down-fill"></i>
              {sortOptionsOpen && (
                <div className="sort-dropdown" onClick={(e) => e.stopPropagation()}>
                  <strong>Sort by:</strong>
                  <select
                    id="sortField"
                    name="sortField"
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                  >
                    <option value="first_name">First Name</option>
                    <option value="last_name">Last Name</option>
                    <option value="student_id">Student ID</option>
                    <option value="year_level">Year Level</option>
                  </select>

                  <strong>Filter by:</strong>
                  <select
                    id="filterBy"
                    name="filterBy"
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="cleared">Cleared</option>
                    <option value="notCleared">Not Cleared</option>
                    <option value="approved">Approved</option>
                    <option value="notApproved">Not Approved</option>
                  </select>

                  <strong>Student Status:</strong>
                  <select
                    id="statusFilter"
                    name="statusFilter"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1); // reset pagination
                    }}
                    style={{ width: "100%", marginBottom: 8 }}
                  >
                    <option value="all">All</option>
                    <option value="regular">Regular</option>
                    <option value="irregular">Irregular</option>
                  </select>

                  <strong>Sort Direction:</strong>
                  <select
                    id="sortDirection"
                    name="sortDirection"
                    value={sortDirection}
                    onChange={(e) => setSortDirection(e.target.value)}
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              )}
            </th>
          </tr>
        </thead>

        <tbody>
          {paginatedStudents.map((s) => (
            <tr key={s.student_id}>
              <td>{s.student_id}</td>
              <td>{s.last_name}</td>
              <td>{s.first_name}</td>
              <td>{s.year_level}</td>
              <td>{s.student_status}</td>
              <td className="actions-cell">
                <i className="bi bi-three-dots-vertical menu-icon"></i>
                <div className="actions-menu">
                  <button onClick={() => handleViewDetails(s)} data-tooltip="View">
                    <i className="bi bi-eye"></i>
                  </button>

                  {(s.enrollment_status === 0 || s.enrollment_status === null) && s.is_approved === 1 && (
                    <button onClick={() => handleClearance(s.student_id)} data-tooltip="Clear">
                      <i className="bi bi-shield-check"></i>
                    </button>
                  )}

                  {s.enrollment_status === 1 && s.is_approved && (
                    <button
                      onClick={() => handleRevokeClearance(s.student_id)}
                      data-tooltip="Revoke Clearance"
                    >
                      <i className="bi bi-shield-x"></i>
                    </button>
                  )}

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        <span>
          {currentPage}/{totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          &gt;
        </button>
      </div>
    </div>
  </div>
);

}
