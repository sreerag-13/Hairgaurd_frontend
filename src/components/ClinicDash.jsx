import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DoctorNav from "./DoctorNav";

const ClinicDash = () => {
    const navigate = useNavigate();
    const [clinic, setClinic] = useState({
        clinicName: "",
        email: "",
        phone: "",
        address: "",
        state: "",
        city: "",
        licenseNumber: "",
        experienceYears: "",
        description: "",
        image: "",
    });
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [errorBookings, setErrorBookings] = useState(null);

    const clinicId = sessionStorage.getItem("_id");

    useEffect(() => {
        const storedImage = sessionStorage.getItem("image");
        setClinic({
            clinicName: sessionStorage.getItem("clinicName") || "N/A",
            email: sessionStorage.getItem("email") || "N/A",
            phone: sessionStorage.getItem("phone") || "N/A",
            address: sessionStorage.getItem("address") || "N/A",
            state: sessionStorage.getItem("state") || "N/A",
            city: sessionStorage.getItem("city") || "N/A",
            licenseNumber: sessionStorage.getItem("licenseNumber") || "N/A",
            experienceYears: sessionStorage.getItem("experienceYears") || "N/A",
            description: sessionStorage.getItem("description") || "No description available",
            image: storedImage ? `http://localhost:3031/uploads/${storedImage}` : "",
        });

        if (!clinicId) {
            setErrorBookings("No clinic ID found. Please log in again.");
            setLoadingBookings(false);
            return;
        }

        const fetchBookings = async () => {
            try {
                const response = await axios.get(`http://localhost:3031/clinic-bookings/${clinicId}`);
                if (response.data.status === "success") {
                    setBookings(response.data.data);
                } else {
                    setErrorBookings(response.data.message || "Failed to fetch bookings");
                }
            } catch (err) {
                console.error("Error fetching bookings:", err);
                setErrorBookings("An error occurred while fetching bookings");
            } finally {
                setLoadingBookings(false);
            }
        };

        fetchBookings();
    }, [clinicId]);

    return (
        <div
            style={{
                display: "flex", // Flex layout to accommodate sidebar and content
                minHeight: "100vh", // Full viewport height
                width: "100vw", // Full viewport width
                background: "linear-gradient(120deg, #eef2f3 0%, #e6e9f0 100%)",
                fontFamily: "'Roboto', sans-serif",
            }}
        >
            <DoctorNav /> {/* Sidebar */}
            <div
                style={{
                    marginLeft: "250px", // Offset for sidebar width
                    flex: 1, // Takes remaining space
                    padding: "20px",
                    overflowY: "auto", // Scrollable content if needed
                    width: "calc(100vw - 250px)", // Adjust width to fit screen minus sidebar
                }}
            >
                <div
                    style={{
                        maxWidth: "900px",
                        width: "100%", // Full width within container
                        backgroundColor: "#ffffff",
                        borderRadius: "16px",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                        padding: "40px",
                        margin: "0 auto", // Center the card
                        boxSizing: "border-box",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "32px",
                            fontWeight: "700",
                            color: "#1a3c5e",
                            marginBottom: "25px",
                            textAlign: "center",
                            letterSpacing: "0.5px",
                            wordWrap: "break-word", // Prevent overflow
                        }}
                    >
                        Welcome, {clinic.clinicName}
                    </h2>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: "40px",
                            marginBottom: "40px",
                            flexWrap: "wrap", // Wrap for responsiveness
                            justifyContent: "center",
                        }}
                    >
                        <div style={{ flexShrink: 0 }}>
                            {clinic.image ? (
                                <img
                                    src={clinic.image}
                                    alt="Clinic"
                                    style={{
                                        width: "180px",
                                        height: "180px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        border: "5px solid #1e90ff",
                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                        transition: "transform 0.3s ease",
                                    }}
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/180";
                                        console.error("Image failed to load:", clinic.image);
                                    }}
                                    onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
                                    onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: "180px",
                                        height: "180px",
                                        borderRadius: "50%",
                                        backgroundColor: "#f1f3f5",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "18px",
                                        color: "#7f8c8d",
                                        border: "5px solid #1e90ff",
                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                    }}
                                >
                                    No Image
                                </div>
                            )}
                        </div>
                        <div style={{ flexGrow: 1, minWidth: "250px" }}>
                            <p style={{ fontSize: "18px", color: "#2c3e50", margin: "10px 0", fontWeight: "500" }}>
                                <strong>Email:</strong> <span style={{ fontWeight: "400" }}>{clinic.email}</span>
                            </p>
                            <p style={{ fontSize: "18px", color: "#2c3e50", margin: "10px 0", fontWeight: "500" }}>
                                <strong>Phone:</strong> <span style={{ fontWeight: "400" }}>{clinic.phone}</span>
                            </p>
                            <p style={{ fontSize: "18px", color: "#2c3e50", margin: "10px 0", fontWeight: "500" }}>
                                <strong>Location:</strong> <span style={{ fontWeight: "400" }}>{clinic.city}, {clinic.state}</span>
                            </p>
                        </div>
                    </div>

                    <div
                        style={{
                            backgroundColor: "#fafcff",
                            padding: "25px",
                            borderRadius: "12px",
                            border: "1px solid #e0e6ed",
                            transition: "box-shadow 0.3s ease",
                            marginBottom: "40px", // Space between sections
                        }}
                        onMouseOver={(e) => (e.target.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.05)")}
                        onMouseOut={(e) => (e.target.style.boxShadow = "none")}
                    >
                        <h3
                            style={{
                                fontSize: "24px",
                                color: "#1e90ff",
                                marginBottom: "20px",
                                fontWeight: "600",
                            }}
                        >
                            Clinic Details
                        </h3>
                        <p style={{ fontSize: "16px", color: "#34495e", margin: "12px 0", lineHeight: "1.6" }}>
                            <strong>Address:</strong> {clinic.address}, {clinic.city}, {clinic.state}
                        </p>
                        <p style={{ fontSize: "16px", color: "#34495e", margin: "12px 0", lineHeight: "1.6" }}>
                            <strong>License Number:</strong> {clinic.licenseNumber}
                        </p>
                        <p style={{ fontSize: "16px", color: "#34495e", margin: "12px 0", lineHeight: "1.6" }}>
                            <strong>Experience:</strong> {clinic.experienceYears} years
                        </p>
                        <p style={{ fontSize: "16px", color: "#34495e", margin: "12px 0", lineHeight: "1.6" }}>
                            <strong>Description:</strong> {clinic.description}
                        </p>
                    </div>

                    <div
                        style={{
                            backgroundColor: "#fafcff",
                            padding: "25px",
                            borderRadius: "12px",
                            border: "1px solid #e0e6ed",
                        }}
                    >
                        <h3
                            style={{
                                fontSize: "24px",
                                color: "#1e90ff",
                                marginBottom: "20px",
                                fontWeight: "600",
                            }}
                        >
                            Recent Appointments
                        </h3>
                        {loadingBookings ? (
                            <p>Loading bookings...</p>
                        ) : errorBookings ? (
                            <p style={{ color: "#dc3545" }}>{errorBookings}</p>
                        ) : bookings.length === 0 ? (
                            <p>No recent bookings found.</p>
                        ) : (
                            <div style={{ overflowX: "auto" }}>
                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        backgroundColor: "#ffffff",
                                        borderRadius: "8px",
                                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            <th
                                                style={{
                                                    padding: "12px",
                                                    backgroundColor: "#1e90ff",
                                                    color: "#ffffff",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                User Name
                                            </th>
                                            <th
                                                style={{
                                                    padding: "12px",
                                                    backgroundColor: "#1e90ff",
                                                    color: "#ffffff",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                Doctor Name
                                            </th>
                                            <th
                                                style={{
                                                    padding: "12px",
                                                    backgroundColor: "#1e90ff",
                                                    color: "#ffffff",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                Date
                                            </th>
                                            <th
                                                style={{
                                                    padding: "12px",
                                                    backgroundColor: "#1e90ff",
                                                    color: "#ffffff",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                Time
                                            </th>
                                            <th
                                                style={{
                                                    padding: "12px",
                                                    backgroundColor: "#1e90ff",
                                                    color: "#ffffff",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                Treatment
                                            </th>
                                            <th
                                                style={{
                                                    padding: "12px",
                                                    backgroundColor: "#1e90ff",
                                                    color: "#ffffff",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.slice(0, 3).map((booking) => (
                                            <tr key={booking._id}>
                                                <td style={{ padding: "12px", borderBottom: "1px solid #e0e6ed" }}>
                                                    {booking.userId?.UName || booking.userName}
                                                </td>
                                                <td style={{ padding: "12px", borderBottom: "1px solid #e0e6ed" }}>
                                                    {booking.doctorId?.DoctorName[0] || booking.doctorName}
                                                </td>
                                                <td style={{ padding: "12px", borderBottom: "1px solid #e0e6ed" }}>
                                                    {new Date(booking.bookingDate).toLocaleDateString()}
                                                </td>
                                                <td style={{ padding: "12px", borderBottom: "1px solid #e0e6ed" }}>
                                                    {booking.slotTime}
                                                </td>
                                                <td style={{ padding: "12px", borderBottom: "1px solid #e0e6ed" }}>
                                                    {booking.treatmentType}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "12px",
                                                        borderBottom: "1px solid #e0e6ed",
                                                        color:
                                                            booking.status === "confirmed"
                                                                ? "#28a745"
                                                                : booking.status === "cancelled"
                                                                ? "#dc3545"
                                                                : "#ffc107",
                                                    }}
                                                >
                                                    {booking.status}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <button
                            style={{
                                backgroundColor: "#1e90ff",
                                color: "#ffffff",
                                padding: "10px 20px",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "16px",
                                marginTop: "20px",
                                transition: "background-color 0.3s ease",
                            }}
                            onClick={() => navigate("/Appointment")}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#1565c0")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#1e90ff")}
                        >
                            View All Appointments
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClinicDash;