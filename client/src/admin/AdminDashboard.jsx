import React, { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import API from "../api/api";
import Sidebar from "./components/Sidebar";
import './css/admin.css';
import './css/student.css';
import './css/settings.css';
import "../css/ProfilePage.css";
import "../css/GradesPage.css";


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
  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [admin, setAdmin] = useState(null);
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

  const fetchAllStudents = useCallback(async () => {
    try {
      const res = await API.get("admin/students", {
        params: {
          academic_year: settings.current_academic_year,
          semester: settings.current_semester,
        },
      });

      // Always return an array
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching students:", err);
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

  const fetchAdmin = useCallback(async (admin_id) => {
    if (!admin_id) return; // skip if no ID
    try {
      const res = await API.get(`admin/${admin_id}`);
      setAdmin(res.data);

      setSettings((prev) => ({
        ...prev,
        admin_id: res.data.admin_id,
        admin_user: res.data.admin_user,
        is_2fa_enabled: res.data.is_2fa_enabled,
      }));
    } catch (err) {
      console.error("Failed to fetch admin:", err);
      addToast("Failed to fetch admin info ❌", "error");
    }
  }, [addToast]);

  // Redirect unauthorized users
  useEffect(() => {
    if (!authLoading && (!user || (userRole !== "admin" && userRole !== "faculty"))) {
      navigate("/");
      return;
    }

    if (userRole === "admin") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        fetchAdmin(parsedUser.id);
      }
    }
  }, [authLoading, user, userRole, navigate, fetchAdmin]);

  // 🔹 Initial fetch
  useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        await fetchSettings();
        await fetchAllStudents();
        await Promise.allSettled([fetchPrograms(), fetchDepartments(), fetchSubjects(), fetchFaculty(), fetchAdmin()]);
      } catch {
        addToast("Failed to fetch initial data ❌", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user, fetchSettings, fetchPrograms, fetchDepartments, fetchSubjects, fetchAllStudents, fetchFaculty,fetchAdmin, addToast]);

  // 🔹 Select student from dashboard
  const handleSelectStudentFromDashboard = useCallback(async (student) => {
    setLoading(true);
    try {
      // Fetch full student info
      const res = await API.get(`/students/${student.student_id}`);
      const fullStudent = res.data;

      setSelectedStudent(fullStudent); // pass full object
      setSearchQuery(fullStudent.full_name || "");
      setActiveTab("records");
    } catch (err) {
      console.error(err);
      addToast("Failed to fetch student details ❌", "error");
    } finally {
      setLoading(false);
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
      <div>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSelectedStudent={setSelectedStudent}
          logout={logout}
          navigate={navigate}
          currentUser={user}
          adminInfo={admin}
          userRole={userRole}
          isSidebarOpen={isSidebarOpen}
        />
        <button
          className={`sidebar-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "✖" : "☰"}
        </button>
      </div>
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
          {activeTab === "enrollment" && (
            <EnrollmentTab
              students={students}
              setStudents={setStudents}
              settings={settings}
              filterYear={filterYear}
              setYearFilter={setFilterYear}
              programs={programs}
              departments={departments}
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
          {activeTab === "faculty" && (
            <FacultyTab
              settings={settings}
              currenUser={user}
              fetchSettings={fetchSettings}
              faculty={faculty}
              setFaculty={setFaculty}
              fetchFaculty={fetchFaculty}
              subjects={subjects}
              fetchSubjects={fetchSubjects}
              departments={departments}
              loading={loading}
              setLoading={setLoading}
            />
          )}
          {activeTab === "students" && userRole !== "student" && (
            <StudentsTab
              settings={settings}
              students={students}
              currentUser={user}
              role={userRole}
              setStudents={setStudents}
              fetchAllStudents={fetchAllStudents}
              departments={departments}
              programs={programs}
              programFilter={filterProgram}
              setProgramFilter={setFilterProgram}
              fetchPrograms={fetchPrograms}
              setActiveTab={setActiveTab}
              onViewDetails={handleSelectStudentFromDashboard}
            />
          )}
          {activeTab === "settings" && (
            <SettingsTab
              settings={settings}
              setSettings={setSettings}
              fetchSettings={fetchSettings}
              loading={loading}
              setLoading={setLoading}
              setActiveTab={setActiveTab}
              currentUser={user}
              role={userRole}
              admin={admin}
              setAdmin={setAdmin}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
}
