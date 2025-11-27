import React, { useState} from 'react';
import '../css/Sidebar.css';
import { useAuth } from '../context/AuthContext';
import defaultUserImg from "../img/default_user.webp";

const Sidebar = ({
    onHome,
    onGrades,
    onEnroll,
    onSchedule,
    onNotifications,
    onProfile,
    onLogout,
}) => {
    const { student } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);


    return (
        <>
            <button
                className={`sidebar-toggle-btn${sidebarOpen ? ' active' : ''}`}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{ display: 'none' }}
            >
                ☰
            </button>
            <div className={`sidebar${sidebarOpen ? ' open' : ''}`}>
                <div className="text-center mb-4">
                    <img
                        src={defaultUserImg}
                        alt="Student"
                        onClick={onProfile}
                        style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            background: "#f0f0f0"
                        }}
                    />
                    <h2>Welcome, {student?.first_name || 'Student'}!</h2>
                </div>
                <div className="nav-menu">
                    <button className="nav-item" onClick={onHome}>Home</button>
                    <button className="nav-item" onClick={onNotifications}>Notifications</button>
                    <button className="nav-item logout" onClick={onLogout}>Log Out</button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
