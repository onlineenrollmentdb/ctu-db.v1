import React from "react";

export default function Sidebar({
  activeTab,
  setActiveTab,
  logout,
  navigate,
  adminInfo,
  currentUser,
  userRole,
  setSelectedStudent,
  isSidebarOpen,
}) {

  const isAdmin = userRole === "admin";
  const isDean = currentUser?.role === 'dean';
  const tabs = [
    { key: "dashboard", label: "Dashboard" },
    { key: "records", label: "Records" },
    { key: "subjects", label: "Subjects" },
    { key: "students", label: "Students" },
    ...(isAdmin || isDean
      ? [{ key: "enrollment", label: "Enrollment" }] // Only Admin or Dean
      : []),
    ...(isAdmin
      ? [{ key: "faculty", label: "Faculty" }] // Only Admin
      : []),
    { key: "settings", label: "Settings" },
  ];


  return (
    <aside className={`admin-sidebar ${isSidebarOpen ? "show" : ""}`}>
      <h2>
        Welcome {isAdmin ? adminInfo?.admin_user : currentUser?.first_name || "Faculty"}
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
