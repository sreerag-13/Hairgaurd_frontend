import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserNav from "./UserNav"; // Import the navbar

const UserProfile = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");
  const [userData, setUserData] = useState({
    UName: "",
    Email: "",
    Gender: "",
    Phone: "",
    uaddress: "",
    state: "",
    City: "",
    profilePicture: null,
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3031/user/${userId}`);
        if (response.data.status === "success") {
          setUserData(response.data.data);
        }
      } catch (err) {
        setError("Failed to fetch user data");
      }
    };
    if (userId) fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      if (key !== "profilePicture") formData.append(key, userData[key]);
    });
    if (file) formData.append("profilePicture", file);

    try {
      const response = await axios.put(`http://localhost:3031/user/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.status === "success") {
        Object.keys(userData).forEach((key) => {
          sessionStorage.setItem(key === "uaddress" ? "userAddress" : `user${key}`, userData[key]);
        });
        if (response.data.data.profilePicture) {
          sessionStorage.setItem("userProfilePicture", response.data.data.profilePicture);
        }
        alert("Profile updated successfully!");
        navigate("/UserDash"); // Adjusted to match UserNav route
      }
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      {/* Navbar */}
      <UserNav />

      {/* Profile Container */}
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2 style={headerStyle}>Your Profile</h2>

          {/* Profile Picture */}
          {userData.profilePicture && (
            <div style={imageContainerStyle}>
              <img
                src={`http://localhost:3031${userData.profilePicture}`}
                alt="Profile"
                style={imageStyle}
              />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Name</label>
              <input
                type="text"
                name="UName"
                value={userData.UName}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Enter your name"
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                name="Email"
                value={userData.Email}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Enter your email"
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Gender</label>
              <select name="Gender" value={userData.Gender} onChange={handleChange} style={selectStyle}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Phone</label>
              <input
                type="text"
                name="Phone"
                value={userData.Phone}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Enter your phone number"
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Address</label>
              <input
                type="text"
                name="uaddress"
                value={userData.uaddress}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Enter your address"
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>State</label>
              <input
                type="text"
                name="state"
                value={userData.state}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Enter your state"
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>City</label>
              <input
                type="text"
                name="City"
                value={userData.City}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Enter your city"
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Profile Picture</label>
              <input
                type="file"
                onChange={handleFileChange}
                style={fileInputStyle}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={loading ? buttonDisabledStyle : buttonStyle}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = "#1a252f")}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = "#2c3e50")}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>

          {error && <p style={errorStyle}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

// Inline CSS Styles
const pageStyle = {
  backgroundColor: "#f4f7fa",
  minHeight: "100vh",
  fontFamily: "'Arial', sans-serif",
};

const containerStyle = {
  maxWidth: "900px",
  margin: "40px auto",
  padding: "0 20px",
};

const cardStyle = {
  backgroundColor: "#fff",
  borderRadius: "15px",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
  padding: "40px",
  overflow: "hidden",
};

const headerStyle = {
  textAlign: "center",
  color: "#2c3e50",
  fontSize: "28px",
  fontWeight: "700",
  marginBottom: "30px",
  borderBottom: "2px solid #2c3e50",
  paddingBottom: "10px",
};

const imageContainerStyle = {
  textAlign: "center",
  marginBottom: "30px",
};

const imageStyle = {
  width: "150px",
  height: "150px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "4px solid #2c3e50",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const labelStyle = {
  color: "#34495e",
  fontWeight: "600",
  fontSize: "16px",
};

const inputStyle = {
  padding: "12px 15px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "16px",
  color: "#34495e",
  backgroundColor: "#f9fafb",
  transition: "border-color 0.3s, box-shadow 0.3s",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const selectStyle = {
  ...inputStyle,
  appearance: "none",
  background: "#f9fafb url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"6\" fill=\"%2334495e\"><path d=\"M0 0h12L6 6z\"/></svg>') no-repeat right 15px center",
  paddingRight: "30px",
};

const fileInputStyle = {
  padding: "10px 0",
  fontSize: "16px",
  color: "#34495e",
};

const buttonStyle = {
  padding: "14px",
  backgroundColor: "#2c3e50",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "18px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "background-color 0.3s",
  textAlign: "center",
};

const buttonDisabledStyle = {
  ...buttonStyle,
  backgroundColor: "#95a5a6",
  cursor: "not-allowed",
};

const errorStyle = {
  color: "#e74c3c",
  textAlign: "center",
  marginTop: "20px",
  fontSize: "16px",
  fontWeight: "500",
};

export default UserProfile;