import React, { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import API from "../api/api";
import Sidebar from "./components/Sidebar";
import './css/admin.css';
import './css/student.css';
import './css/settings.css';

// Lazy-loaded tabs
const DashboardTab = React.lazy(() => import("./tabs/DashboardTab"));
const RecordsTab = React.lazy(() => import("./tabs/RecordsTab"));
const SubjectsTab = React.lazy(() => import("./tabs/SubjectsTab"));
const FacultyTab = React.lazy(() => import("./tabs/FacultyTab"));
const EnrollmentTab = React.lazy(() => import("./tabs/EnrollmentTab"));
const SettingsTab = React.lazy(() => import("./tabs/SettingsTab"));
const StudentsTab = React.lazy(() => import("./tabs/StudentsTab"));

export default function AdminDashboard() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { user, role: userRole, logout, loading: authLoading } = useAuth();

  // Split state for performance
  const [settings, setSettings] = useState({ current_academic_year: "", current_semester: "" });
  const [programs, setPrograms] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProgram, setFilterProgram] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // 🔹 Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Redirect unauthorized users
  useEffect(() => {
    if (!authLoading && (!user || (userRole !== "admin" && userRole !== "faculty"))) {
      navigate("/");
    }
  }, [authLoading, user, userRole, navigate]);

  // 🔹 API fetch functions
  const fetchSettings = useCallback(async () => {
    try {
      const res = await API.get("settings/");
      setSettings(res.data);
    } catch {
      addToast("Failed to fetch settings ❌", "error");
    }
  }, [addToast]);

  const fetchPrograms = useCallback(async () => {
    try {
      const res = await API.get("programs/");
      setPrograms(res.data);
    } catch {
      addToast("Failed to fetch programs ❌", "error");
    }
  }, [addToast]);

  const fetchDepartments = useCallback(async () => {
    try {
      const res = await API.get("programs/departments/");
      setDepartments(res.data);
    } catch {
      addToast("Failed to fetch departments ❌", "error");
    }
  }, [addToast]);

  const fetchSubjects = useCallback(async () => {
    try {
      const res = await API.get("subjects/");
      setSubjects(res.data);
    } catch {
      addToast("Failed to fetch subjects ❌", "error");
    }
  }, [addToast]);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await API.get("admin/students", {
        params: { academic_year: settings.current_academic_year, semester: settings.current_semester },
      });
      setStudents(res.data);
    } catch {
      addToast("Failed to fetch students ❌", "error");
    }
  }, [addToast, settings.current_academic_year, settings.current_semester]);

  const fetchFaculty = useCallback(async () => {
    try {
      const res = await API.get("faculty/");
      setFaculty(res.data);
    } catch {
      addToast("Failed to fetch faculty ❌", "error");
    }
  }, [addToast]);

  // 🔹 Initial fetch
  useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        await fetchSettings();
        await Promise.allSettled([fetchPrograms(), fetchDepartments(), fetchSubjects(), fetchStudents(), fetchFaculty()]);
      } catch {
        addToast("Failed to fetch initial data ❌", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user, fetchSettings, fetchPrograms, fetchDepartments, fetchSubjects, fetchStudents, fetchFaculty, addToast]);

  // 🔹 Select student from dashboard
  const handleSelectStudentFromDashboard = useCallback(async (student) => {
    setSelectedStudent(student);
    setSearchQuery(student.full_name || "");
    setActiveTab("records");
    try {
      const res = await API.get(`grades/student/${student.student_id}`);
      setSubjects(res.data.records);
    } catch {
      addToast("Error fetching student records ❌", "error");
    }
  }, [addToast]);

  // 🔹 Filtered students (memoized)
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesProgram = !filterProgram || student.program_id === parseInt(filterProgram);
      const matchesYear = !filterYear || student.year_level === parseInt(filterYear);
      const fullName = `${student.first_name || ""} ${student.middle_name || ""} ${student.last_name || ""}`.trim().toLowerCase();
      const search = debouncedQuery.toLowerCase();
      return (student.student_id?.toString().includes(search) || fullName.includes(search)) &&
             matchesProgram &&
             matchesYear;
    });
  }, [students, filterProgram, filterYear, debouncedQuery]);

  if (authLoading || loading || !user) return <div>Loading...</div>;

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className={`admin-sidebar ${isSidebarOpen ? "show" : ""}`}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSelectedStudent={setSelectedStudent}
          logout={logout}
          navigate={navigate}
          currentUser={user}
          userRole={userRole}
        />
      </div>
      <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? "✖" : "☰"}
      </button>

      {/* Main panel */}
      <div className="middle-panel">
        <Suspense fallback={<div>Loading Tab...</div>}>
          {activeTab === "dashboard" && (
            <DashboardTab
              students={students}
              settings={settings}
              setStudents={setStudents}
              setActiveTab={setActiveTab}
              onViewDetails={handleSelectStudentFromDashboard}
            />
          )}
          {activeTab === "records" && userRole !== "student" && (
            <RecordsTab
              students={students}
              programs={programs}
              settings={settings}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedStudent={selectedStudent}
              setSelectedStudent={setSelectedStudent}
              programFilter={filterProgram}
              setProgramFilter={setFilterProgram}
              filteredStudents={filteredStudents}
              userRole={userRole}
            />
          )}
          {activeTab === "enrollment" && userRole === "admin" && (
            <EnrollmentTab
              students={students}
              settings={settings}
              filterYear={filterYear}
              setYearFilter={setFilterYear}
              programs={programs}
            />
          )}
          {activeTab === "subjects" && (
            <SubjectsTab
              settings={settings}
              filterYear={filterYear}
              programs={programs}
              programFilter={filterProgram}
              subjects={subjects}
              setSubjects={setSubjects}
              fetchSubjects={fetchSubjects}
              fetchPrograms={fetchPrograms}
              setPrograms={setPrograms}
              setYearFilter={setFilterYear}
              loading={loading}
              userRole={userRole}
            />
          )}
          {activeTab === "faculty" && userRole === "admin" && (
            <FacultyTab
              settings={settings}
              faculty={faculty}
              setFaculty={setFaculty}
              fetchFaculty={fetchFaculty}
              departments={departments}
              loading={loading}
              setLoading={setLoading}
            />
          )}
          {activeTab === "students" && userRole === "admin" && (
            <StudentsTab
              settings={settings}
              students={students}
              setStudents={setStudents}
              fetchStudents={fetchStudents}
              programs={programs}
              programFilter={filterProgram}
              setProgramFilter={setFilterProgram}
              fetchPrograms={fetchPrograms}
            />
          )}
          {activeTab === "settings" && userRole === "admin" && (
            <SettingsTab
              settings={settings}
              setSettings={setSettings}
              fetchSettings={fetchSettings}
              loading={loading}
              setLoading={setLoading}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
}
