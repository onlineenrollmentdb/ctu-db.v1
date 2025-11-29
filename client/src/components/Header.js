import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import API from "../api/api";
import logo from "../img/ctu_logo.webp";
import defaultUser from "../img/default_user.webp";
import "../css/Header.css";

const Header = ({ onHome, onEnroll, onGrades, onProfile, onLogout, settings }) => {
  const { user: student } = useAuth();
  const location = useLocation();

  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const modalRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [announcement, setAnnouncement] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  const activeTab = useMemo(() => {
    if (!student) return "";
    if (location.pathname.startsWith("/enroll")) return "enroll";
    if (location.pathname.startsWith("/grades")) return "grades";
    if (location.pathname.startsWith("/profile")) return "profile";
    return "home";
  }, [location.pathname, student]);

  const fullName = useMemo(() => {
    if (!student) return "";
    return `${student.first_name || ""} ${student.middle_name || ""} ${student.last_name || ""}`
      .replace(/\s+/g, " ")
      .trim();
  }, [student]);

  const fetchNotifications = useCallback(async () => {
    if (!student) return;
    try {
      const res = await API.get(`/notifications/student/${student.student_id}`);
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }, [student]);

  const toggleDropdown = useCallback(async () => {
    const next = !showDropdown;
    setShowDropdown(next);

    if (!student) return;

    if (next) {
      await fetchNotifications();
      const unseen = notifications.filter((n) => !n.is_seen);
      unseen.forEach(async (n) => {
        try {
          await API.put(`/notifications/${n.notification_id}/seen`);
        } catch (err) {}
      });
    }
  }, [showDropdown, fetchNotifications, notifications, student]);

  useEffect(() => {
    if (!student) return;
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 15000);

    return () => clearInterval(interval);
  }, [student, fetchNotifications]);

  useEffect(() => {
    if (!settings) return;

    const now = new Date();
    const sems = [
      {
        type: "1st",
        enrollStart: new Date(settings.first_sem_enrollment_start),
        enrollEnd: new Date(settings.first_sem_enrollment_end),
        semStart: new Date(settings.first_sem_start),
        semEnd: new Date(settings.first_sem_end),
      },
      {
        type: "2nd",
        enrollStart: new Date(settings.second_sem_enrollment_start),
        enrollEnd: new Date(settings.second_sem_enrollment_end),
        semStart: new Date(settings.second_sem_start),
        semEnd: new Date(settings.second_sem_end),
      },
    ];

    let data = null;
    for (const s of sems) {
      if (now >= s.enrollStart && now <= s.enrollEnd) {
        data = { message: `${s.type} semester enrollment is now open!`, color: "green", ...s };
        break;
      } else if (now < s.enrollStart && now >= new Date(s.enrollStart.getTime() - 30 * 24 * 60 * 60 * 1000)) {
        data = { message: `${s.type} semester enrollment is coming soon!`, color: "orange", ...s };
        break;
      } else if (now >= s.semStart && now <= s.semEnd) {
        data = { message: `${s.type} semester is ongoing!`, color: "blue", ...s };
        break;
      }
    }

    setAnnouncement(data);
  }, [settings]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileDropdown(false);
      if (showAnnouncementModal && modalRef.current && !modalRef.current.contains(e.target)) setShowAnnouncementModal(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAnnouncementModal]);

  if (!student) return null;

  const serverURL = process.env.REACT_APP_SOCKET;
  const profilePicture = student.profile_picture ? `${serverURL}${student.profile_picture}` : defaultUser;
  const enrollmentDisabled = student.enrollment_status < 1;

  return (
    <header className="header-grid">
      <div className="logo">
        <img src={logo} alt="Logo" className="header-logo" loading="lazy" />
      </div>

      <div className="nav-profile">
        {/* Home */}
        <button className={`nav-btn ${activeTab === "home" ? "active" : ""}`} onClick={onHome}>
          <i className="bi bi-house"></i>
          <span className="hide-on-mobile">Home</span>
        </button>

        {/* Enrollment */}
        <button
          className={`nav-btn ${activeTab === "enroll" ? "active" : ""} ${enrollmentDisabled ? "disabled" : ""}`}
          disabled={enrollmentDisabled}
          onClick={!enrollmentDisabled ? onEnroll : undefined}
        >
          <i className="bi bi-pencil"></i>
          <span className="hide-on-mobile">Enrollment</span>
        </button>

        {/* Grades */}
        <button className={`nav-btn ${activeTab === "grades" ? "active" : ""}`} onClick={onGrades}>
          <i className="bi bi-bar-chart"></i>
          <span className="hide-on-mobile">Grades</span>
        </button>

        {/* Notifications */}
        <div className="notification-bell" ref={dropdownRef} onClick={toggleDropdown}>
          <i className="bi bi-bell"></i>
          {notifications.some((n) => !n.is_seen) && <span className="notification-dot"></span>}

          {showDropdown && (
            <div className="notification-dropdown">
              <div className="notif-header"><h6>Notifications</h6></div>
              {notifications.length === 0 ? <p className="empty">No notifications</p> :
                <ul>
                  {notifications.map((notif) => (
                    <li key={notif.notification_id} className={`notif-item ${notif.is_read ? "read" : "unread"}`}>
                      <div className="notif-content" onClick={() => API.put(`/notifications/${notif.notification_id}/read`)}>
                        <div className="notif-title-row">
                          {notif.title && <strong>{notif.title}</strong>}
                          <button className="delete-notif-btn" onClick={(e) => {
                            e.stopPropagation();
                            API.delete(`/notifications/${notif.notification_id}`);
                            setNotifications(prev => prev.filter(n => n.notification_id !== notif.notification_id));
                          }}>×</button>
                        </div>
                        <p>{notif.message}</p>
                        <small>{new Date(notif.created_at).toLocaleString()}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              }
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="profile" ref={profileRef} onClick={() => setShowProfileDropdown(prev => !prev)}>
          {student.profile_picture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="avatar-img"
              loading="lazy"
            />
          ) : (
            <i className="bi bi-person-circle avatar-icon"></i>
          )}

          <p className="hide-on-mobile">{fullName}</p>

          {showProfileDropdown && (
            <div className="profile-dropdown">
              <button className="profile-btn" onClick={onProfile}>View Profile</button>
              <p className="mobile-profile-name">{fullName}</p>
              <p><strong>ID:</strong> {student.student_id}</p>
              <p><strong>Year:</strong> {student.year_level}</p>
              <p><strong>Section:</strong> {student.section}</p>
              <p><strong>Course:</strong> {student.program_code}</p>
              <p><strong>Status:</strong> <span className={`status ${student.student_status === "Regular" ? "regular" : "irregular"}`}>{student.student_status}</span></p>
              <button className="logout-btn" onClick={onLogout}>
                <i className="bi bi-box-arrow-right"></i> Logout
              </button>
            </div>
          )}
        </div>
      </div>
        {/* Announcement */}
        {announcement && (
          <div className="announcement">
            <i className="bi bi-megaphone ann-icon"></i>
            <span style={{ color: announcement.color }}>{announcement.message}</span>
            <button className="view-date-btn" onClick={() => setShowAnnouncementModal(true)}>View Dates</button>
          </div>
        )}

        {/* Announcement Modal */}
        {showAnnouncementModal && announcement && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: "400px" }} ref={modalRef}>
              <h5>{announcement.type} Semester Enrollment</h5>
              <p>Enrollment Starts: <span style={{ color: "var(--primary-color)" }}>{announcement.enrollStart.toLocaleDateString()}</span></p>
              <p>Enrollment Ends: <span style={{ color: "var(--primary-color)" }}>{announcement.enrollEnd.toLocaleDateString()}</span></p>
            </div>
          </div>
        )}

        {/* Academic Year / Semester */}
        {settings && (
          <div className="academic-info">
            Academic Year: {settings.current_academic_year} | Semester: {settings.current_semester}
          </div>
        )}
    </header>
  );
};

export default memo(Header);
