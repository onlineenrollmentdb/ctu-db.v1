import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useToast } from "../../context/ToastContext";
import API from "../../api/api";

const parseDBDate = (dbDate) => (dbDate ? new Date(dbDate) : new Date());
const formatMonthDay = (date) => {
  const parsedDate = parseDBDate(date);
  return parsedDate
    ? parsedDate.toLocaleDateString("en-US", { month: "long", day: "2-digit" })
    : "";
};

export default function SettingsTab({
  settings,
  setSettings,
  fetchSettings,
  loading,
  setLoading,
  currentUser,
  role,
  admin,
  setAdmin,
}) {
  const isAdmin = role === "admin";
  const isFaculty = role === "faculty";

  const [editMode, setEditMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [previewSettings, setPreviewSettings] = useState(null);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const { addToast } = useToast();

  // ============================ FACULTY PROFILE FORM STATE ============================
  const [facultyEditMode, setFacultyEditMode] = useState(false);

  const [facultyForm, setFacultyForm] = useState({
    first_name: currentUser?.first_name || "",
    last_name: currentUser?.last_name || "",
    email: currentUser?.email || "",
    faculty_role: currentUser?.role || "",
  });

  const handleFacultyChange = (key, value) => {
    setFacultyForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveFaculty = async () => {
    try {
      setLoading(true);
      await API.put(`/faculty/update-profile`, {
        faculty_id: currentUser.faculty_id,
        ...facultyForm,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({ ...currentUser, ...facultyForm })
      );

      addToast("Profile updated successfully!", "success");
      setFacultyEditMode(false);
    } catch (err) {
      console.error(err);
      addToast("Error updating profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ======== SETTINGS HANDLERS ========
  const handleChange = (key, date) => {
    if (!editMode) return;
    setSettings((prev) => ({ ...prev, [key]: date }));
  };

  const renderPicker = (key, type = "date") => {
    return (
      <DatePicker
        selected={parseDBDate(settings[key])}
        onChange={(d) => handleChange(key, d)}
        dateFormat="MMMM dd"
        showPopperArrow={false}
        disabled={!editMode}
        className={editMode ? "editable-datepicker" : "readonly-datepicker"}
      />
    );
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = {
        first_sem_start: parseDBDate(settings.first_sem_start)
          .toISOString()
          .split("T")[0],
        first_sem_end: parseDBDate(settings.first_sem_end).toISOString().split("T")[0],
        second_sem_start: parseDBDate(settings.second_sem_start)
          .toISOString()
          .split("T")[0],
        second_sem_end: parseDBDate(settings.second_sem_end).toISOString().split("T")[0],
        summer_start: parseDBDate(settings.summer_start).toISOString().split("T")[0],
        summer_end: parseDBDate(settings.summer_end).toISOString().split("T")[0],
        first_sem_enrollment_start: parseDBDate(settings.first_sem_enrollment_start)
          .toISOString()
          .split("T")[0],
        first_sem_enrollment_end: parseDBDate(settings.first_sem_enrollment_end)
          .toISOString()
          .split("T")[0],
        second_sem_enrollment_start: parseDBDate(settings.second_sem_enrollment_start)
          .toISOString()
          .split("T")[0],
        second_sem_enrollment_end: parseDBDate(settings.second_sem_enrollment_end)
          .toISOString()
          .split("T")[0],
        current_academic_year: settings.current_academic_year,
        enable_2fa: settings.enable_2fa ? 1 : 0,
        admin_username: settings.admin_username,
      };

      if (settings.new_password && settings.new_password.trim() !== "") {
        payload.new_password = settings.new_password;
      }

      await API.put("/settings", payload);

      addToast("Settings updated successfully!", "success");
      setEditMode(false);
      fetchSettings();
    } catch (err) {
      console.error(err);
      addToast("Error saving settings.", "error");
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  const handleAdminUpdate = async (username, password) => {
    if (!admin?.admin_id) return;
    try {
      setLoading(true);
      await API.put("/admin/account/update", {
        admin_id: admin.admin_id,
        admin_user: username,
        new_password: password || undefined,
      });
      addToast("Admin account updated successfully!", "success");
      setAdmin((prev) => ({ ...prev, admin_user: username }));
    } catch (err) {
      console.error(err);
      addToast("Failed to update admin account", "error");
    } finally {
      setLoading(false);
      setShowAdminModal(false);
    }
  };

  if (!settings) return <p>Loading settings...</p>;

  return (
    <>
      <div className="settings-container">
        <div className="header-sub">
          <h1 className="header-main">SETTINGS MANAGEMENT</h1>
        </div>

        {/* ================= ADMIN SETTINGS ================= */}
        {isAdmin && (
          <>
            <div className="settings-grid">
              <div className="settings-semesters">
                {["first_sem", "second_sem", "summer"].map((sem) => (
                  <div key={sem} className="settings-section minimalist-section">
                    <h3>
                      {sem === "first_sem"
                        ? "1st Semester"
                        : sem === "second_sem"
                        ? "2nd Semester"
                        : "Summer"}
                    </h3>
                    <div className="settings-row" style={{ gap: "1rem" }}>
                      {sem !== "summer" && (
                        <div style={{ marginBottom: "1rem" }}>
                          <label>
                            <h2>Enrollment Date</h2>
                          </label>
                          {editMode ? (
                            <div style={{ display: "flex", gap: "1rem" }}>
                              {renderPicker(`${sem}_enrollment_start`, "enrollment")}
                              {renderPicker(`${sem}_enrollment_end`, "enrollment")}
                            </div>
                          ) : (
                            <h6 style={{ margin: 0 }}>
                              {formatMonthDay(settings[`${sem}_enrollment_start`])} -{" "}
                              {formatMonthDay(settings[`${sem}_enrollment_end`])}
                            </h6>
                          )}
                        </div>
                      )}
                      <div style={{ marginBottom: "1rem" }}>
                        <label>
                          <h2>Semester Date</h2>
                        </label>
                        {editMode ? (
                          <div style={{ display: "flex", gap: "1rem" }}>
                            {renderPicker(`${sem}_start`, "semester")}
                            {renderPicker(`${sem}_end`, "semester")}
                          </div>
                        ) : (
                          <h6 style={{ margin: 0 }}>
                            {formatMonthDay(
                              sem === "summer"
                                ? settings.summer_start
                                : settings[`${sem}_start`]
                            )}{" "}
                            -{" "}
                            {formatMonthDay(
                              sem === "summer"
                                ? settings.summer_end
                                : settings[`${sem}_end`]
                            )}
                          </h6>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="settings-actions" style={{ marginTop: "1rem" }}>
                <div>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      if (editMode) setShowConfirmModal(true);
                      else setEditMode(true);
                    }}
                  >
                    {editMode ? "Save Settings" : "Edit Settings"}
                  </button>

                  {editMode && (
                    <button
                      className="btn btn-cancel"
                      onClick={() => {
                        fetchSettings();
                        setEditMode(false);
                      }}
                    >
                      Cancel
                    </button>
                  )}

                  {editMode && (
                    <button
                      className="btn btn-edit"
                      onClick={() => {
                        setPreviewSettings({ ...settings });
                        setShowShiftModal(true);
                      }}
                    >
                      Shift Semester
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="settings-admin-panel minimalist-section">
              <h2 style={{ marginTop: "10px" }}>⚙️ Admin Account Security</h2>

              <div className="toggle-row">
                <label>Enable 2FA Verification</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={admin?.is_2fa_enabled === 1}
                    onChange={async () => {
                      if (!admin?.admin_id) return;
                      const newVal = admin.is_2fa_enabled === 1 ? 0 : 1;
                      try {
                        setLoading(true);
                        await API.put("/admin/twofa/update", {
                          admin_id: admin.admin_id,
                          is_2fa_enabled: newVal,
                        });
                        setAdmin((prev) => ({ ...prev, is_2fa_enabled: newVal }));
                        setSettings((prev) => ({ ...prev, is_2fa_enabled: newVal }));
                        addToast(
                          `Two-factor authentication ${newVal ? "Enabled" : "Disabled"}`,
                          "success"
                        );
                      } catch (err) {
                        console.error(err);
                        addToast("Error updating 2FA setting", "error");
                      } finally {
                        setLoading(false);
                      }
                    }}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div style={{ marginTop: "10px" }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAdminModal(true)}
                >
                  Edit Admin Account
                </button>
              </div>
            </div>
          </>
        )}

        {/* ================= FACULTY PROFILE DISPLAY THEN EDIT ================= */}
        {isFaculty && (
          <div className="settings-admin-panel minimalist-section">
            <h2 style={{ marginTop: "10px" }}>👤 Faculty Profile</h2>

            {!facultyEditMode ? (
              <>
                <p><b>First Name:</b> {facultyForm.first_name}</p>
                <p><b>Last Name:</b> {facultyForm.last_name}</p>
                <p><b>Email:</b> {facultyForm.email}</p>
                <p><b>Role:</b> {facultyForm.faculty_role}</p>

                <button
                  className="btn btn-primary"
                  style={{ marginTop: "10px" }}
                  onClick={() => setFacultyEditMode(true)}
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                <div className="profile-input-row">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={facultyForm.first_name}
                    onChange={(e) => handleFacultyChange("first_name", e.target.value)}
                  />
                </div>

                <div className="profile-input-row">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={facultyForm.last_name}
                    onChange={(e) => handleFacultyChange("last_name", e.target.value)}
                  />
                </div>

                <div className="profile-input-row">
                  <label>Email</label>
                  <input
                    type="email"
                    value={facultyForm.email}
                    onChange={(e) => handleFacultyChange("email", e.target.value)}
                  />
                </div>

                <div className="profile-input-row">
                  <label>Role</label>
                  <input
                    type="text"
                    value={facultyForm.faculty_role}
                    disabled
                  />
                </div>

                <button
                  className="btn btn-primary"
                  style={{ marginTop: "10px", marginRight: "10px" }}
                  onClick={handleSaveFaculty}
                >
                  Save
                </button>

                <button
                  className="btn btn-cancel"
                  style={{ marginTop: "10px" }}
                  onClick={() => setFacultyEditMode(false)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* CONFIRM SAVE SETTINGS */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h5>Confirm Save</h5>
            <p>This action will overwrite important academic settings. Are you sure?</p>
            <div className="mt-3">
              <button className="btn btn-primary" onClick={handleSave}>
                Yes, Save
              </button>
              <button
                className="btn btn-cancel"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHIFT SEMESTER MODAL */}
      {showShiftModal && previewSettings && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h5>Shift 1st Semester</h5>
            <p>Update the 1st Semester start and end dates only.</p>

            <div className="mb-3">
              <label>1st Semester Start:</label>
              <DatePicker
                selected={previewSettings.first_sem_start}
                onChange={(date) =>
                  setPreviewSettings((prev) => ({ ...prev, first_sem_start: date }))
                }
                dateFormat="MMMM dd"
              />
            </div>

            <div className="mb-3">
              <label>1st Semester End:</label>
              <DatePicker
                selected={previewSettings.first_sem_end}
                onChange={(date) =>
                  setPreviewSettings((prev) => ({ ...prev, first_sem_end: date }))
                }
                dateFormat="MMMM dd"
              />
            </div>

            <div className="mt-3">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSettings(previewSettings);
                  setPreviewSettings(null);
                  setShowShiftModal(false);
                }}
              >
                Apply
              </button>
              <button
                className="btn btn-cancel"
                onClick={() => setShowShiftModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN ACCOUNT MODAL */}
      {showAdminModal && (
        <AdminAccountModal
          admin={admin}
          setAdmin={setAdmin}
          show={showAdminModal}
          onClose={() => setShowAdminModal(false)}
          addToast={addToast}
          handleAdminUpdate={handleAdminUpdate}
        />
      )}
    </>
  );
}

// ======= ADMIN ACCOUNT MODAL COMPONENT =======
function AdminAccountModal({ admin, setAdmin, show, onClose, addToast, handleAdminUpdate }) {
  const [username, setUsername] = useState(admin?.admin_user || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading] = useState(false);

  React.useEffect(() => {
    const errors = [];
    if (password) {
      if (password.length < 8) errors.push("At least 8 characters");
      if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
      if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter");
      if (!/\d/.test(password)) errors.push("At least one number");
      if (!/[\W_]/.test(password)) errors.push("At least one special character");
      if (confirmPassword && password !== confirmPassword)
        errors.push("Passwords do not match");
    }
    setPasswordErrors(errors);
  }, [password, confirmPassword]);

  const handleSave = async () => {
    if (passwordErrors.length > 0) return;
    await handleAdminUpdate(username, password);
    setPassword("");
    setConfirmPassword("");
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content admin-modal">
        <h3>Edit Admin Account</h3>

        <div className="input-with-icon">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-with-icon password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password (leave empty = no change)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? "Hide" : "Show"}
          </i>
        </div>

        <div className="input-with-icon password-container">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <i onClick={() => setShowConfirm((prev) => !prev)}>
            {showConfirm ? "Hide" : "Show"}
          </i>
        </div>

        {password && passwordErrors.length > 0 && (
          <ul>
            {passwordErrors.map((err, idx) => (
              <li key={idx} className="invalid">
                ✗ {err}
              </li>
            ))}
          </ul>
        )}
        {password && passwordErrors.length === 0 && (
          <p className="valid">✔ Password looks good</p>
        )}

        <div className="modal-buttons">
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button className="btn btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
