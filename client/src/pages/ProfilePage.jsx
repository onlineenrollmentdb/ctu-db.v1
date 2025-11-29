import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../css/ProfilePage.css";
import defaultUser from "../img/default_user.webp";
import { useToast } from "../context/ToastContext";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";

// Labels
const fieldLabels = {
  first_name: "First Name",
  middle_name: "Middle Name",
  last_name: "Last Name",
  email: "Email Address",
  contact_number: "Contact Number",
  permanent_address: "Permanent Address",
  congressional_district: "District",
  region: "Region",
  gender: "Gender",
  birth_date: "Birthday",
  birthplace: "Birth Place",
  citizenship: "Citizenship",
  religion: "Religion",
  civil_status: "Civil Status",
  father_name: "Father's Name",
  father_occupation: "Father's Occupation",
  father_contact: "Father's Contact",
  mother_name: "Mother's Name",
  mother_occupation: "Mother's Occupation",
  mother_contact: "Mother's Contact",
  guardian_name: "Guardian's Name",
  guardian_relationship: "Relation to Guardian",
  guardian_contact: "Guardian's Contact Number",
  guardian_email: "Guardian's Email",
};

// Required fields
const requiredFields = [
  "first_name",
  "middle_name",
  "last_name",
  "contact_number",
  "permanent_address",
  "congressional_district",
  "region",
  "gender",
  "email",
  "civil_status",
  "birth_date",
  "birthplace",
  "citizenship",
  "religion",
];

const ProfilePage = () => {
  const { user: student, updateUser } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  // Cropper state
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [cropping, setCropping] = useState(false);
  const [showCropper, setShowCropper] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Load student profile
  useEffect(() => {
    if (!student) return navigate("/");
    API.get(`/students/${student.student_id}`)
      .then((res) => setData(res.data))
      .catch(() => setData(student))
      .finally(() => setLoading(false));
  }, [student, navigate]);

  if (loading) return <div>Loading profile information...</div>;
  if (!data) return <div>No student data available.</div>;

  const onChange = (name, value) =>
    setData((prev) => ({ ...prev, [name]: value }));

  /** Save edited profile */
  const handleSaveClick = async () => {
    setLoading(true);
    for (let field of requiredFields) {
      if (!data[field] || data[field].toString().trim() === "") {
        addToast(`❌ ${fieldLabels[field] || field} is required`, "error");
        setLoading(false);
        return;
      }
    }

    const allowedFields = Object.keys(fieldLabels);
    const filteredData = Object.keys(data)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});

    try {
      await API.put(`/students/${data.student_id}`, filteredData);
      setData((prev) => ({ ...prev, ...filteredData }));
      updateUser({ ...student, ...filteredData });
      addToast("✅ Profile updated successfully", "success");
      setEditing(false);
    } catch (err) {
      console.error(err.response?.data || err);
      const message = err.response?.data?.error || "Failed to update profile";
      addToast(`❌ ${message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  /** Handle profile picture change */
  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(URL.createObjectURL(file));
    setShowCropper(true);
  };

  /** Save cropped image */
  const saveCroppedImage = async () => {
    if (!selectedFile || !croppedAreaPixels) return;
    setCropping(true);
    try {
      const croppedImage = await getCroppedImg(selectedFile, croppedAreaPixels);
      const formData = new FormData();
      formData.append("profile_picture", croppedImage);

      const res = await API.post(
        `/students/${data.student_id}/upload-picture`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setData((prev) => ({ ...prev, profile_picture: res.data.filePath }));
      updateUser({ ...student, profile_picture: res.data.filePath });
      addToast("✅ Profile picture updated successfully!", "success");
    } catch (err) {
      console.error(err);
      addToast("❌ Failed to upload picture", "error");
    } finally {
      setCropping(false);
      setShowCropper(false);
      setSelectedFile(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  };

  const serverURL = process.env.REACT_APP_API.replace("/api", "");
  const profilePicture = data.profile_picture
    ? `${serverURL}${data.profile_picture}`
    : defaultUser;

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <h2 className="profile-header">Student Profile</h2>

        <div className="profile-grid-advanced">
          {/* Profile Picture */}
          <div className="profile-picture">
            <div className={`profile-pic-wrapper ${editing ? "editing" : ""}`}>
              <img
                src={profilePicture}
                alt="Profile"
                className="profile-img"
                onError={(e) => (e.target.src = defaultUser)}
              />

              {editing && (
                <div className="overlay always-visible">
                  <span className="overlay-text">Change Profile?</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePictureChange}
                  />
                </div>
              )}
            </div>

            {/* Cropper modal */}
{/* Cropper modal */}
{showCropper && selectedFile && (
  <div className="cropper-modal">
    <div className="cropper-container">
      <div className="cropper-inner">
        <Cropper
          image={selectedFile}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      {/* Zoom Slider */}
      <input
        type="range"
        min={1}
        max={3}
        step={0.01}
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
        className="cropper-slider"
      />

      {/* Save / Cancel Buttons */}
      <div className="cropper-actions">
        <button
          className="btn btn-primary"
          onClick={saveCroppedImage}
          disabled={cropping}
        >
          {cropping ? "Saving..." : "Save"}
        </button>
        <button
          className="btn btn-cancel"
          onClick={() => {
            setShowCropper(false);
            setSelectedFile(null);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

          </div>

          {/* Editable Fields */}
          {Object.keys(fieldLabels).map((key) => (
            <ProfileField
              key={key}
              label={fieldLabels[key]}
              name={key}
              value={data[key]}
              editable={editing}
              onChange={onChange}
              required={requiredFields.includes(key)}
              type={key === "birth_date" ? "date" : "text"}
            />
          ))}

          {/* Non-editable fields */}
          <ProfileField
            label="Student ID"
            name="student_id"
            value={data.student_id}
            editable={false}
            onChange={onChange}
          />
          <ProfileField
            label="Course"
            name="program_code"
            value={data.program_code + " - " + data.program_name}
            editable={false}
            onChange={onChange}
          />
          <ProfileField
            label="Year and Section"
            name="year_section"
            value={data.year_level + " - " + data.section}
            editable={false}
            onChange={onChange}
          />
          <ProfileField
            label="Enrollment Status"
            name="enrollment_status"
            value={data.is_enrolled === 1 ? "Enrolled" : "Not Enrolled"}
            editable={false}
            onChange={onChange}
          />
        </div>

        {/* Actions */}
        <div className="profile-actions">
          {editing ? (
            <>
              <button
                className="btn btn-primary"
                onClick={handleSaveClick}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                className="btn btn-cancel"
                onClick={() => {
                  setEditing(false);
                  API.get(`/students/${data.student_id}`).then((res) =>
                    setData(res.data)
                  );
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button className="btn btn-edit" onClick={() => setEditing(true)}>
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ProfileField component */
const ProfileField = ({
  label,
  value,
  name,
  onChange,
  editable,
  type = "text",
  required,
}) => {
  const formatValue = () => {
    if (!value) return "";
    if (type === "date") return value.split("T")[0];
    return value;
  };

  const isEmpty = required && (!value || value.toString().trim() === "");

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {editable ? (
        <input
          className={`form-input ${isEmpty ? "input-error" : ""}`}
          type={type}
          name={name}
          value={formatValue()}
          onChange={(e) => onChange(name, e.target.value)}
        />
      ) : (
        <div className="form-static">{formatValue() || "-"}</div>
      )}
    </div>
  );
};

export default ProfilePage;
