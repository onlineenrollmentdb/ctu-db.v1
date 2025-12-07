import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({
  activeTab,
  setActiveTab,
  logout,
  navigate,
  setSelectedStudent,
  isSidebarOpen,
}) {
  const { user, role } = useAuth();
  const isAdmin = role === "admin";

  const tabs = [
    { key: "dashboard", label: "Dashboard" },
    { key: "records", label: "Records" },
    { key: "subjects", label: "Subjects" },
    { key: "students", label: "Students" },
    ...(isAdmin
      ? [
          { key: "enrollment", label: "Enrollment" },
          { key: "faculty", label: "Faculty" },
          { key: "settings", label: "Settings" },
        ]
      : []),
  ];

  return (
    <aside className={`admin-sidebar ${isSidebarOpen ? "show" : ""}`}>
      <h2>
        Welcome {isAdmin ? "Admin" : user?.username || "Faculty Member"}
      </h2>

      <nav>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => {
              setActiveTab(tab.key);
              setSelectedStudent?.(null);
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <button
        className="logout-btn"
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
        Logout
      </button>
    </aside>
  );
}
