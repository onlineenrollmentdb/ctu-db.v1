import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "./Header";
import API from "../api/api";

const Layout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get("/settings");
        setSettings(res.data);
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="layout-container">
      <div className="layout-right">
        <Header
          settings={settings} // ✅ Pass settings here
          onLogout={handleLogout}
          onEnroll={() => navigate("/enroll")}
          onHome={() => navigate("/home")}
          onGrades={() => navigate("/grades")}
          onSchedule={() => navigate("/schedule")}
          onNotifications={() => navigate("/notifications")}
          onProfile={() => navigate("/profile")}
        />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
