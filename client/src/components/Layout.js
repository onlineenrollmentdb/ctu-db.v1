import React, { lazy, Suspense, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";

// Lazy load Header
const Header = lazy(() => import("./Header"));

const Layout = React.memo(({ children }) => {
  const { logout } = useAuth();
  const settings = useSettings();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  const handleNavigate = useCallback(
    (path) => () => navigate(path),
    [navigate]
  );

  const navProps = {
    onLogout: handleLogout,
    onEnroll: handleNavigate("/enroll"),
    onHome: handleNavigate("/home"),
    onGrades: handleNavigate("/grades"),
    onSchedule: handleNavigate("/schedule"),
    onNotifications: handleNavigate("/notifications"),
    onProfile: handleNavigate("/profile"),
  };

  return (
    <div className="layout-container">
      <div className="layout-right">
        <Suspense fallback={<div>Loading header...</div>}>
          <Header {...navProps} settings={settings} />
        </Suspense>
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
});

export default Layout;
