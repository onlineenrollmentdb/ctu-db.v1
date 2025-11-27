import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import API from "../api/api";
import Sidebar from "./components/Sidebar";
import DashboardTab from "./tabs/DashboardTab";
import RecordsTab from "./tabs/RecordsTab";
import SubjectsTab from "./tabs/SubjectsTab";
import FacultyTab from "./tabs/FacultyTab";
import EnrollmentTab from "./tabs/EnrollmentTab";
import SettingsTab from "./tabs/SettingsTab";
import StudentsTab from "./tabs/StudentsTab";
import './css/admin.css';
import './css/student.css';
import './css/faculty.css';
import './css/settings.css';

export default function AdminDashboard() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { user, role: userRole, logout, loading: authLoading } = useAuth();

  // Group state for simplicity
  const [state, setState] = useState({
    settings: { current_academic_year: "", current_semester: "" },
    programs: [],
    students: [],
    subjects: [],
    faculty: [],
    departments: [],
    activeTab: "dashboard",
    searchQuery: "",
    filterProgram: "",
    filterYear: "",
    selectedStudent: null,
    isSidebarOpen: false,
    loading: true
  });

  const updateState = useCallback((updates) => setState(prev => ({ ...prev, ...updates })), []);

  // Redirect unauthorized users
  useEffect(() => {
    if (!authLoading && (!user || (userRole !== "admin" && userRole !== "faculty"))) {
      navigate("/");
    }
  }, [authLoading, user, userRole, navigate]);

  // 🔹 Memoized fetch functions
  const fetchSettings = useCallback(async () => {
    try {
      const res = await API.get("settings/");
      updateState({ settings: res.data });
    } catch {
      addToast("Failed to fetch settings ❌", "error");
    }
  }, [addToast, updateState]);

  const fetchPrograms = useCallback(async () => {
    try {
      const res = await API.get("programs/");
      updateState({ programs: res.data });
    } catch {
      addToast("Failed to fetch programs ❌", "error");
    }
  }, [addToast, updateState]);

  const fetchDepartments = useCallback(async () => {
    try {
      const res = await API.get("programs/departments/");
      updateState({ departments: res.data });
    } catch {
      addToast("Failed to fetch departments ❌", "error");
    }
  }, [addToast, updateState]);

  const fetchSubjects = useCallback(async () => {
    try {
      const res = await API.get("subjects/");
      updateState({ subjects: res.data });
    } catch {
      addToast("Failed to fetch subjects ❌", "error");
    }
  }, [addToast, updateState]);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await API.get("admin/students", {
        params: {
          academic_year: state.settings.current_academic_year,
          semester: state.settings.current_semester,
        },
      });
      updateState({ students: res.data });
    } catch {
      addToast("Failed to fetch students ❌", "error");
    }
  }, [addToast, state.settings.current_academic_year, state.settings.current_semester, updateState]);

  const fetchFaculty = useCallback(async () => {
    try {
      const res = await API.get("faculty/");
      updateState({ faculty: res.data });
    } catch {
      addToast("Failed to fetch faculty ❌", "error");
    }
  }, [addToast, updateState]);

  // Fetch all initial data
  useEffect(() => {
    if (!user) return;

    const fetchAllData = async () => {
      try {
        updateState({ loading: true });
        await fetchSettings();
        await Promise.all([
          fetchPrograms(),
          fetchDepartments(),
          fetchSubjects(),
          fetchStudents(),
          fetchFaculty()
        ]);
      } catch {
        addToast("Failed to fetch initial data ❌", "error");
      } finally {
        updateState({ loading: false });
      }
    };

    fetchAllData();
  }, [user, fetchSettings, fetchPrograms, fetchDepartments, fetchSubjects, fetchStudents, fetchFaculty, addToast, updateState]);

  const handleSelectStudentFromDashboard = useCallback(async (student) => {
    updateState({ searchQuery: student.full_name || "", selectedStudent: student, activeTab: "records" });
    try {
      const res = await API.get(`grades/student/${student.student_id}`);
      updateState({ subjects: res.data.records });
    } catch {
      addToast("Error fetching student records ❌", "error");
    }
  }, [addToast, updateState]);

  // Derived memoized filtered students
  const filteredStudents = useMemo(() => {
    return state.students.filter((student) => {
      const matchesProgram = !state.filterProgram || student.program_id === parseInt(state.filterProgram);
      const matchesYear = !state.filterYear || student.year_level === parseInt(state.filterYear);
      const fullName = `${student.first_name || ""} ${student.middle_name || ""} ${student.last_name || ""}`.trim().toLowerCase();
      const search = state.searchQuery.toLowerCase();
      return (student.student_id?.toString().includes(search) || fullName.includes(search)) &&
             matchesProgram &&
             matchesYear;
    });
  }, [state.students, state.filterProgram, state.filterYear, state.searchQuery]);

  if (authLoading || state.loading || !user) return <div>Loading...</div>;

  return (
    <div className="admin-dashboard">
      <div className={`admin-sidebar ${state.isSidebarOpen ? "show" : ""}`}>
        <Sidebar
          activeTab={state.activeTab}
          setActiveTab={(tab) => updateState({ activeTab: tab })}
          setSelectedStudent={(s) => updateState({ selectedStudent: s })}
          logout={logout}
          navigate={navigate}
          currentUser={user}
          userRole={userRole}
        />
      </div>

      <button className="sidebar-toggle" onClick={() => updateState({ isSidebarOpen: !state.isSidebarOpen })}>
        {state.isSidebarOpen ? "✖" : "☰"}
      </button>

      <div className="middle-panel">
        {state.activeTab === "dashboard" && (
          <DashboardTab
            students={state.students}
            settings={state.settings}
            setStudents={(s) => updateState({ students: s })}
            setActiveTab={(t) => updateState({ activeTab: t })}
            onViewDetails={handleSelectStudentFromDashboard}
          />
        )}

        {state.activeTab === "records" && userRole !== "student" && (
          <RecordsTab
            students={state.students}
            programs={state.programs}
            settings={state.settings}
            searchQuery={state.searchQuery}
            setSearchQuery={(q) => updateState({ searchQuery: q })}
            selectedStudent={state.selectedStudent}
            setSelectedStudent={(s) => updateState({ selectedStudent: s })}
            programFilter={state.filterProgram}
            setProgramFilter={(p) => updateState({ filterProgram: p })}
            filteredStudents={filteredStudents}
            userRole={userRole}
          />
        )}

        {state.activeTab === "enrollment" && userRole === "admin" && (
          <EnrollmentTab
            students={state.students}
            settings={state.settings}
            filterYear={state.filterYear}
            setYearFilter={(y) => updateState({ filterYear: y })}
            programs={state.programs}
          />
        )}

        {state.activeTab === "subjects" && (
          <SubjectsTab
            settings={state.settings}
            filterYear={state.filterYear}
            programs={state.programs}
            programFilter={state.filterProgram}
            subjects={state.subjects}
            setSubjects={(s) => updateState({ subjects: s })}
            fetchSubjects={fetchSubjects}
            fetchPrograms={fetchPrograms}
            setPrograms={(p) => updateState({ programs: p })}
            setYearFilter={(y) => updateState({ filterYear: y })}
            loading={state.loading}
            userRole={userRole}
          />
        )}

        {state.activeTab === "faculty" && userRole === "admin" && (
          <FacultyTab
            settings={state.settings}
            faculty={state.faculty}
            setFaculty={(f) => updateState({ faculty: f })}
            fetchFaculty={fetchFaculty}
            departments={state.departments}
            loading={state.loading}
            setLoading={(l) => updateState({ loading: l })}
          />
        )}

        {state.activeTab === "students" && userRole === "admin" && (
          <StudentsTab
            settings={state.settings}
            students={state.students}
            setStudents={(s) => updateState({ students: s })}
            fetchStudents={fetchStudents}
            programs={state.programs}
            programFilter={state.filterProgram}
            setProgramFilter={(p) => updateState({ filterProgram: p })}
            fetchPrograms={fetchPrograms}
          />
        )}

        {state.activeTab === "settings" && userRole === "admin" && (
          <SettingsTab
            settings={state.settings}
            setSettings={(s) => updateState({ settings: s })}
            fetchSettings={fetchSettings}
            loading={state.loading}
            setLoading={(l) => updateState({ loading: l })}
          />
        )}
      </div>
    </div>
  );
}
