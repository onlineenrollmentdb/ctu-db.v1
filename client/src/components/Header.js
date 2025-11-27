import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import API from "../api/api";
import logo from "../img/ctu_logo.png";
import defaultUser from "../img/default-user.png";
import "../css/Header.css";

const Header = ({ onHome, onEnroll, onGrades, onProfile, onLogout, settings }) => {
  const { user: student } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [announcement, setAnnouncement] = useState(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const modalRef = useRef(null);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("home");

  // Determine active tab
  useEffect(() => {
    if (!student) return;
    if (location.pathname.startsWith("/enroll")) setActiveTab("enroll");
    else if (location.pathname.startsWith("/grades")) setActiveTab("grades");
    else if (location.pathname.startsWith("/profile")) setActiveTab("profile");
    else setActiveTab("home");
  }, [location.pathname, student]);


// Build announcement from settings
useEffect(() => {
  if (!settings) return;

  const now = new Date();

  // Enrollment periods
  const firstEnrollStart = new Date(settings.first_sem_enrollment_start);
  const firstEnrollEnd = new Date(settings.first_sem_enrollment_end);
  const secondEnrollStart = new Date(settings.second_sem_enrollment_start);
  const secondEnrollEnd = new Date(settings.second_sem_enrollment_end);

  // Semester periods
  const firstSemStart = new Date(settings.first_sem_start);
  const firstSemEnd = new Date(settings.first_sem_end);
  const secondSemStart = new Date(settings.second_sem_start);
  const secondSemEnd = new Date(settings.second_sem_end);

  let data = null;

  // --- Enrollment Open ---
  if (now >= firstEnrollStart && now <= firstEnrollEnd) {
    data = {
      message: "Enrollment for 1st semester is now open!",
      color: "green",
      semester: "1st",
      start: firstEnrollStart,
      end: firstEnrollEnd,
    };
  } else if (now >= secondEnrollStart && now <= secondEnrollEnd) {
    data = {
      message: "Enrollment for 2nd semester is now open!",
      color: "green",
      semester: "2nd",
      start: secondEnrollStart,
      end: secondEnrollEnd,
    };
  }

  // --- Coming Soon (1 month before enrollment) ---
  else if (now < firstEnrollStart && now >= new Date(firstEnrollStart.getTime() - 30 * 24 * 60 * 60 * 1000)) {
    data = {
      message: "Enrollment for 1st semester is coming soon!",
      color: "orange",
      semester: "1st",
      start: firstEnrollStart,
      end: firstEnrollEnd,
    };
  } else if (now < secondEnrollStart && now >= new Date(secondEnrollStart.getTime() - 30 * 24 * 60 * 60 * 1000)) {
    data = {
      message: "Enrollment for 2nd semester is coming soon!",
      color: "orange",
      semester: "2nd",
      start: secondEnrollStart,
      end: secondEnrollEnd,
    };
  }

  // --- Semester Ongoing ---
  else if (now >= firstSemStart && now <= firstSemEnd) {
    data = {
      message: "1st semester is ongoing!",
      color: "blue",
      semester: "1st",
      start: firstSemStart,
      end: firstSemEnd,
    };
  } else if (now >= secondSemStart && now <= secondSemEnd) {
    data = {
      message: "2nd semester is ongoing!",
      color: "blue",
      semester: "2nd",
      start: secondSemStart,
      end: secondSemEnd,
    };
  }

  console.log("Announcement determined:", data);
  setAnnouncement(data);
}, [settings]);


  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
        setShowProfileDropdown(false);
      }

      if (showAnnouncementModal && modalRef.current && !modalRef.current.contains(e.target)) {
        setShowAnnouncementModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAnnouncementModal]);

  if (!student) return null;

  const serverURL = process.env.REACT_APP_SOCKET;
  const profilePicture = student.profile_picture
    ? `${serverURL}${student.profile_picture}`
    : defaultUser;

  const getFullName = (s) =>
    s ? `${s.first_name || ""} ${s.middle_name || ""} ${s.last_name || ""}`.replace(/\s+/g, " ").trim() : "";

  // Notifications
  const fetchNotifications = async () => {
    try {
      const res = await API.get(`/notifications/student/${student.student_id}`);
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const toggleDropdown = async () => {
    const next = !showDropdown;
    setShowDropdown(next);

    if (next) {
      await fetchNotifications();
      const unseen = notifications.filter((n) => !n.is_seen);
      unseen.forEach(async (n) => {
        try {
          await API.put(`/notifications/${n.notification_id}/seen`);
        } catch (err) {
          console.error(err);
        }
      });
    }
  };

  const enrollmentDisabled = student.enrollment_status < 1;

  return (
    <header className="header-grid">

      <div className="logo">
        <img src={logo} alt="Logo" className="header-logo" />
      </div>

      <div className="nav-profile">
        <button className={`nav-btn ${activeTab === "home" ? "active" : ""}`} onClick={onHome}>
          <i className="bi bi-house"></i>
          <span className="hide-on-mobile">Home</span>
        </button>

        <button
          className={`nav-btn ${activeTab === "enroll" ? "active" : ""} ${enrollmentDisabled ? "disabled" : ""}`}
          disabled={enrollmentDisabled}
          onClick={!enrollmentDisabled ? onEnroll : undefined}
        >
          <i className="bi bi-pencil-square"></i>
          <span className="hide-on-mobile">Enrollment</span>
        </button>

        <button className={`nav-btn ${activeTab === "grades" ? "active" : ""}`} onClick={onGrades}>
          <i className="bi bi-bar-chart"></i>
          <span className="hide-on-mobile">Grades</span>
        </button>

        {/* BELL */}
        <div className="notification-bell" ref={dropdownRef} onClick={toggleDropdown}>
          <i className="bi bi-bell fs-5"></i>
          {notifications.some((n) => !n.is_seen) && <span className="notification-dot"></span>}

          {showDropdown && (
            <div className="notification-dropdown">
              <div className="notif-header"><h6>Notifications</h6></div>
              {notifications.length === 0 ? (
                <p className="empty">No notifications</p>
              ) : (
                <ul>
                  {notifications.map((notif) => (
                    <li key={notif.notification_id} className={`notif-item ${notif.is_read ? "read" : "unread"}`}>
                      <div className="notif-content" onClick={() => API.put(`/notifications/${notif.notification_id}/read`)}>
                        <div className="notif-title-row">
                          {notif.title && <strong>{notif.title}</strong>}
                          <button
                            className="delete-notif-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              API.delete(`/notifications/${notif.notification_id}`);
                              setNotifications((prev) =>
                                prev.filter((n) => n.notification_id !== notif.notification_id)
                              );
                            }}
                          >
                            ×
                          </button>
                        </div>
                        <p>{notif.message}</p>
                        <small>{new Date(notif.created_at).toLocaleString()}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* PROFILE */}
        <div className="profile" ref={profileRef} onClick={() => setShowProfileDropdown((prev) => !prev)}>
          <img src={profilePicture} alt="Profile" className="avatar-img" />
          <p className="hide-on-mobile">{getFullName(student)}</p>

          {showProfileDropdown && (
            <div className="profile-dropdown">
              <button className="profile-btn" onClick={onProfile}>View Profile</button>
              <p className="mobile-profile-name">{getFullName(student)}</p>
              <p><strong>ID:</strong> {student.student_id}</p>
              <p><strong>Year:</strong> {student.year_level}</p>
              <p><strong>Section:</strong> {student.section}</p>
              <p><strong>Course:</strong> {student.program_code}</p>
              <p><strong>Status:</strong>{" "}
                <span className={`status ${student.student_status === "Regular" ? "regular" : "irregular"}`}>
                  {student.student_status}
                </span>
              </p>
              <button className="logout-btn" onClick={onLogout}>
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ANNOUNCEMENT ROW */}
      {announcement && (
        <div className="announcement">
          <i className="bi bi-megaphone-fill ann-icon"></i>
          <span style={{ color: announcement.color }}>{announcement.message}</span>
          <button className="view-date-btn" onClick={() => setShowAnnouncementModal(true)}>View Dates</button>
        </div>
      )}

      {/* Announcement Modal */}
      {showAnnouncementModal && announcement && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: "400px"}} ref={modalRef}>
            <h5>{announcement.semester} Semester Enrollment</h5>
            <p>
              Starts:{" "}
              <span style={{ color: "var(--primary-color)" }}>
                {announcement.start.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            </p>
            <p>
              Ends:{" "}
              <span style={{ color: "var(--primary-color)" }}>
                {announcement.end.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            </p>
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

export default Header;
