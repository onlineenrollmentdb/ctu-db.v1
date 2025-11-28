import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import API from "../../api/api";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useToast } from "../../context/ToastContext";
import {connectSocket} from "../../socket";

export default function DashboardTab({ students, setStudents, setActiveTab, onViewDetails, settings }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOptionsOpen] = useState(false);
  const [sortField, setSortField] = useState("first_name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterBy] = useState("all");
  const [statusFilter] = useState("all");
  const [currentSemester, setCurrentSemester] = useState("");
  const [enrollmentStatus, setEnrollmentStatus] = useState("");
  const [activeDates, setActiveDates] = useState([]);
  const [enrollmentMessage, setEnrollmentMessage] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const { addToast } = useToast();
  const studentsPerPage = 10;
  const socketRef = useRef(null);

  // Normalize date to midnight
  const normalizeDate = useCallback(d => {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const isWithin = useCallback((date, start, end) => {
    const d = normalizeDate(date);
    return d >= normalizeDate(start) && d <= normalizeDate(end);
  }, [normalizeDate]);

  // 🔹 Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
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
  }, [students, searchQuery, filterBy, statusFilter]);

  // 🔹 Sorting
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      return sortDirection === "asc"
        ? valA > valB ? 1 : valA < valB ? -1 : 0
        : valA < valB ? 1 : valA > valB ? -1 : 0;
    });
  }, [filteredStudents, sortField, sortDirection]);

  // 🔹 Pagination
  const totalPages = Math.ceil(sortedStudents.length / studentsPerPage);
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * studentsPerPage;
    return sortedStudents.slice(startIndex, startIndex + studentsPerPage);
  }, [sortedStudents, currentPage]);

  // 🔹 Stats
  const stats = useMemo(() => {
    const total = students.length;
    const cleared = students.filter(s => s.enrollment_status === 1).length;
    const approved = students.filter(s => s.is_approved === 1).length;
    const enrolled = students.filter(s => s.is_enrolled === 1).length;
    const regular = students.filter(s => s.student_status === "Regular").length;
    const irregular = students.filter(s => s.student_status === "Irregular").length;
    return { total, cleared, approved, enrolled, regular, irregular };
  }, [students]);

  // 🔹 Students by year
  const yearData = useMemo(() => [1, 2, 3, 4].map(lvl => ({
    year: `${lvl} Year`,
    count: students.filter(s => s.year_level === lvl).length,
  })), [students]);

  // 🔹 Semester & enrollment highlight
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

    const getDatesBetween = (start, end) => {
      const arr = [];
      let d = new Date(start);
      while (d <= end) {
        arr.push(new Date(d));
        d.setDate(d.getDate() + 1);
      }
      return arr;
    };

    setActiveDates([
      ...getDatesBetween(firstEnrollStart, firstEnrollEnd),
      ...getDatesBetween(secondEnrollStart, secondEnrollEnd),
    ]);

    if (isWithin(now, firstSemStart, firstSemEnd)) setCurrentSemester("1st Semester");
    else if (isWithin(now, secondSemStart, secondSemEnd)) setCurrentSemester("2nd Semester");
    else setCurrentSemester("Outside Semester");

    let message = "";
    if (isWithin(now, firstEnrollStart, firstEnrollEnd)) {
      setEnrollmentStatus("ongoing");
      message = "Enrollment for 1st Semester is now OPEN!";
    } else if ((firstEnrollStart - now) / (1000 * 60 * 60 * 24) <= 30) {
      setEnrollmentStatus("upcoming");
      message = "Enrollment for 1st Semester is coming soon!";
    } else if (isWithin(now, secondEnrollStart, secondEnrollEnd)) {
      setEnrollmentStatus("ongoing");
      message = "Enrollment for 2nd Semester is now OPEN!";
    } else if ((secondEnrollStart - now) / (1000 * 60 * 60 * 24) <= 30) {
      setEnrollmentStatus("upcoming");
      message = "Enrollment for 2nd Semester is coming soon!";
    } else {
      setEnrollmentStatus("closed");
      message = "Enrollment is currently CLOSED";
    }
    setEnrollmentMessage(message);
  }, [settings, isWithin, normalizeDate]);

  // 🔹 Socket updates (safe cleanup)
  useEffect(() => {
    // Connect socket once on mount
    socketRef.current = connectSocket();

    const handler = (updated) => {
      setStudents(prev =>
        prev.map(s => s.student_id === updated.student_id ? { ...s, ...updated } : s)
      );
    };

    socketRef.current.on("studentUpdated", handler);

    return () => {
      socketRef.current.off("studentUpdated", handler); // cleanup on unmount
    };
  }, [setStudents]);

  // Reset page when filters/search changes
  useEffect(() => setCurrentPage(1), [sortField, sortDirection, filterBy, statusFilter, searchQuery]);
  // Handlers
  const handleViewDetails = useCallback((s) => onViewDetails(s), [onViewDetails]);

  const handleClearance = useCallback(async (student_id) => {
    try {
      await API.put("clearance/update", {
        student_id,
        is_cleared: true,
        academic_year: settings.current_academic_year,
        semester: settings.current_semester,
      });
      setStudents(prev => prev.map(s => s.student_id === student_id ? { ...s, enrollment_status: 1 } : s));

      socketRef.current?.emit("studentUpdated", { student_id, enrollment_status: 1 }); // ✅ use ref
      addToast("Student clearance updated", "success");
    } catch {
      addToast("Failed to update clearance", "error");
    }
  }, [settings, setStudents, addToast]);

  const handleRevokeClearance = useCallback(async (student_id) => {
    try {
      await API.put("clearance/update", {
        student_id,
        is_cleared: false,
        academic_year: settings.current_academic_year,
        semester: settings.current_semester,
      });
      setStudents(prev => prev.map(s => s.student_id === student_id ? { ...s, enrollment_status: 0 } : s));

      socketRef.current?.emit("studentUpdated", { student_id, enrollment_status: 0 }); // ✅ use ref
      addToast("Clearance revoked", "warning");
    } catch {
      addToast("Failed to revoke clearance", "error");
    }
  }, [settings, setStudents, addToast]);

  const handleSortClick = (field) => {
    if (sortField === field) setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDirection("asc"); }
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col mt-4 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
          <h3 className="text-gray-700 font-semibold mb-1 text-sm">Total Students</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
          <h3 className="text-gray-700 font-semibold mb-1 text-sm">Regular</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.regular}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
          <h3 className="text-gray-700 font-semibold mb-1 text-sm">Irregular</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.irregular}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
          <h3 className="text-gray-700 font-semibold mb-1 text-sm">Cleared</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.cleared}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
          <h3 className="text-gray-700 font-semibold mb-1 text-sm">Approved</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.approved}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
          <h3 className="text-gray-700 font-semibold mb-1 text-sm">Enrolled</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.enrolled}</p>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students by Year */}
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-gray-700 font-semibold mb-4 text-sm">Students by Year</h3>
          <BarChart width={500} height={300} data={yearData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </div>

        {/* Enrollment Calendar */}
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center">
          <h3 className="text-gray-700 font-semibold mb-2 text-sm">Enrollment Calendar</h3>
          <p className="font-bold mb-2">{currentSemester}</p>
          <Calendar
            className="w-full rounded-lg shadow p-2"
            value={calendarMonth}
            onChange={() => {}}
            activeStartDate={calendarMonth}
            showNavigation
            next2Label={null}
            prev2Label={null}
            navigationLabel={({ label }) => <span>{label}</span>}
            onActiveStartDateChange={({ activeStartDate }) => setCalendarMonth(activeStartDate)}
            tileClassName={({ date, view }) =>
              view === "month" && activeDates.some(d => d.toDateString() === date.toDateString())
                ? "bg-yellow-500 text-white rounded-md"
                : ""
            }
          />
          <p className={`mt-2 font-semibold ${enrollmentStatus === "ongoing" ? "text-green-600" : enrollmentStatus === "upcoming" ? "text-orange-500" : "text-red-500"}`}>
            {enrollmentMessage}
          </p>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
          <h3 className="text-gray-700 font-semibold text-sm">Students List</h3>
          <div className="flex items-center gap-2 border rounded-lg px-2 py-1 w-full max-w-xs">
            <i className="bi bi-search text-gray-400"></i>
            <input
              placeholder="Search by ID or Name"
              className="outline-none text-sm w-full py-1 px-1"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm table-auto border-separate border-spacing-0">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left cursor-pointer" onClick={() => handleSortClick("student_id")}>
                  Student ID {sortField === "student_id" && <i className={`bi ${sortDirection === "asc" ? "bi-caret-up-fill" : "bi-caret-down-fill"}`}></i>}
                </th>
                <th className="p-2 text-left cursor-pointer" onClick={() => handleSortClick("last_name")}>
                  Last Name {sortField === "last_name" && <i className={`bi ${sortDirection === "asc" ? "bi-caret-up-fill" : "bi-caret-down-fill"}`}></i>}
                </th>
                <th className="p-2 text-left cursor-pointer" onClick={() => handleSortClick("first_name")}>
                  First Name {sortField === "first_name" && <i className={`bi ${sortDirection === "asc" ? "bi-caret-up-fill" : "bi-caret-down-fill"}`}></i>}
                </th>
                <th className="p-2 text-left cursor-pointer" onClick={() => handleSortClick("year_level")}>
                  Year {sortField === "year_level" && <i className={`bi ${sortDirection === "asc" ? "bi-caret-up-fill" : "bi-caret-down-fill"}`}></i>}
                </th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left relative">
                  Sort <i className="bi bi-caret-down-fill"></i>
                  {sortOptionsOpen && <div className="absolute top-full right-0 w-56 bg-white shadow rounded-xl p-2 z-50"></div>}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map(s => (
                <tr key={s.student_id} className="hover:bg-gray-50">
                  <td className="p-2">{s.student_id}</td>
                  <td className="p-2">{s.last_name}</td>
                  <td className="p-2">{s.first_name}</td>
                  <td className="p-2">{s.year_level}</td>
                  <td className="p-2">{s.student_status}</td>
                  <td className="p-2 relative text-right">
                    <i className="bi bi-three-dots-vertical cursor-pointer text-gray-500 hover:text-blue-600"></i>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-1 opacity-0 pointer-events-none group-hover:opacity-100">
                      <button onClick={() => handleViewDetails(s)} className="p-1 rounded hover:bg-gray-100">
                        <i className="bi bi-eye"></i>
                      </button>
                      {(s.enrollment_status === 0 || s.enrollment_status === null) && s.is_approved === 1 &&
                        <button onClick={() => handleClearance(s.student_id)} className="p-1 rounded hover:bg-green-100">
                          <i className="bi bi-shield-check"></i>
                        </button>
                      }
                      {s.enrollment_status === 1 && s.is_approved === 1 &&
                        <button onClick={() => handleRevokeClearance(s.student_id)} className="p-1 rounded hover:bg-red-100">
                          <i className="bi bi-shield-x"></i>
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-4 text-sm text-gray-700">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded bg-gray-200 hover:bg-blue-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">&lt;</button>
          <span>{currentPage}/{Math.max(totalPages, 1)}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1 rounded bg-gray-200 hover:bg-blue-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">&gt;</button>
        </div>
      </div>
    </div>
  );
}