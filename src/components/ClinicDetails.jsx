import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const ClinicDetails = () => {
    const { id } = useParams();
    const [clinic, setClinic] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const BASE_URL = "http://localhost:3031";

    const [currentUser] = useState({
        userId: sessionStorage.getItem("userId"),
        userName: sessionStorage.getItem("userName") || "Guest",
    });

    useEffect(() => {
        const fetchClinicDetails = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/clinic/${id}`);
                if (response.data.status === "success") {
                    setClinic(response.data.data);
                } else {
                    console.error("Clinic Fetch Error:", response.data.message);
                }
            } catch (error) {
                console.error("Clinic API Error:", error);
            }
        };

        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/clinic/${id}/doctors`);
                if (response.data.status === "success") {
                    setDoctors(response.data.data);
                } else {
                    console.error("Doctors Fetch Error:", response.data.message);
                }
            } catch (error) {
                console.error("Doctors API Error:", error);
            }
        };

        fetchClinicDetails();
        fetchDoctors();
    }, [id]);

    const handleBookNow = (doctor) => {
        setSelectedDoctor(doctor);
        setSelectedDate(null);
        setSelectedTime("");
        setAvailableSlots([]);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setSelectedTime("");
        if (selectedDoctor) {
            const slots = generateTimeSlots(selectedDoctor.availability);
            setAvailableSlots(slots);
        }
    };

    const handleTimeSlotChange = (time) => {
        setSelectedTime(time);
    };

    const extractTimeRange = (availability) => {
        const timePattern = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*-\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i;
        const match = availability.match(timePattern);
        if (!match) return null;
        const [, startHour, startMinute = "00", startPeriod, endHour, endMinute = "00", endPeriod] = match;
        return {
            startTime: { hour: parseInt(startHour), minute: parseInt(startMinute), period: startPeriod.toLowerCase() },
            endTime: { hour: parseInt(endHour), minute: parseInt(endMinute), period: endPeriod.toLowerCase() },
        };
    };

    const convertTo24Hour = (hour, period) => {
        if (period === "pm" && hour < 12) return hour + 12;
        if (period === "am" && hour === 12) return 0;
        return hour;
    };

    const formatHour = (hour, minute) => {
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        const displayMinute = minute.toString().padStart(2, "0");
        return `${displayHour}:${displayMinute} ${period}`;
    };

    const generateTimeSlots = (availability) => {
        const timeRange = extractTimeRange(availability);
        if (!timeRange) return [];
        const { startTime, endTime } = timeRange;
        const startHour24 = convertTo24Hour(startTime.hour, startTime.period);
        const endHour24 = convertTo24Hour(endTime.hour, endTime.period);
        const slots = [];
        let currentHour = startHour24;
        let currentMinute = startTime.minute;
        const slotInterval = 30;

        while (
            currentHour < endHour24 ||
            (currentHour === endHour24 && currentMinute < endTime.minute)
        ) {
            let nextHour = currentHour;
            let nextMinute = currentMinute + slotInterval;
            if (nextMinute >= 60) {
                nextHour += 1;
                nextMinute -= 60;
            }
            if (nextHour < endHour24 || (nextHour === endHour24 && nextMinute <= endTime.minute)) {
                const slotStart = formatHour(currentHour, currentMinute);
                const slotEnd = formatHour(nextHour, nextMinute);
                slots.push(`${slotStart} - ${slotEnd}`);
            }
            currentHour = nextHour;
            currentMinute = nextMinute;
        }
        return slots;
    };

    const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

    const handleConfirmBooking = async () => {
        if (!selectedDate || !selectedTime || !selectedDoctor) {
            alert("Please select a date and time slot");
            return;
        }

        if (!currentUser.userId || !isValidObjectId(currentUser.userId)) {
            alert("Invalid user ID. Please log in again.");
            return;
        }
        if (!isValidObjectId(id)) {
            alert("Invalid clinic ID.");
            return;
        }
        if (!isValidObjectId(selectedDoctor._id)) {
            alert("Invalid doctor ID.");
            return;
        }

        const day = selectedDate.getDay();
        if (day === 0 || day === 6) {
            alert("Bookings are not allowed on weekends (Saturday and Sunday).");
            return;
        }

        setLoading(true);

        try {
            const dateOnly = selectedDate.toISOString().split("T")[0];

            const bookingData = {
                userId: currentUser.userId,
                clinicId: id,
                doctorId: selectedDoctor._id,
                userName: currentUser.userName,
                clinicName: clinic.clinicName,
                doctorName: Array.isArray(selectedDoctor.DoctorName)
                    ? selectedDoctor.DoctorName[0]
                    : selectedDoctor.DoctorName,
                bookingDate: dateOnly,
                slotTime: selectedTime,
            };

            console.log("Booking Data Sent:", bookingData);

            const response = await axios.post(`${BASE_URL}/api/bookings/book`, bookingData, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.data.status === "success") {
                alert("Appointment booked successfully!");
                setTimeout(() => {
                    setSelectedDoctor(null);
                    setSelectedDate(null);
                    setSelectedTime("");
                    setAvailableSlots([]);
                }, 500);
            } else {
                alert(response.data.error || "Booking failed");
            }
        } catch (error) {
            console.error("Booking Error:", error.response?.data || error.message);
            alert(error.response?.data?.error || "Failed to book appointment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const tileClassName = ({ date, view }) => {
        if (view === "month") {
            const day = date.getDay();
            if (day === 0 || day === 6) {
                return { style: { backgroundColor: "#ff6f61", color: "#fff", borderRadius: "50%", fontWeight: "bold" } }; // Red for weekends
            }
            return { style: { backgroundColor: "#e0f7fa", color: "#00796b", borderRadius: "50%", fontWeight: "bold" } }; // Teal for weekdays
        }
    };

    if (!clinic) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f7fa" }}>
                <p style={{ fontSize: "20px", color: "#00796b", fontWeight: "600" }}>Loading clinic details...</p>
            </div>
        );
    }

    const imageUrl = clinic.image?.startsWith("/") ? `${BASE_URL}${clinic.image}` : clinic.image || "https://via.placeholder.com/150";

    return (
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px", backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
            {/* Clinic Header */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "20px", boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)", padding: "30px", marginBottom: "40px" }}>
                <h2 style={{ color: "#004d40", fontSize: "36px", fontWeight: "700", textAlign: "center", marginBottom: "20px" }}>{clinic.clinicName}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "40px", flexWrap: "wrap" }}>
                    <img
                        src={imageUrl}
                        alt={clinic.clinicName}
                        style={{ width: "250px", height: "250px", objectFit: "cover", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}
                        onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                    />
                    <div style={{ flex: "1", minWidth: "300px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "15px", fontSize: "18px", color: "#004d40" }}>
                            <span style={{ fontWeight: "600" }}>Email:</span><span>{clinic.email}</span>
                            <span style={{ fontWeight: "600" }}>Phone:</span><span>{clinic.phone}</span>
                            <span style={{ fontWeight: "600" }}>Address:</span><span>{clinic.address}, {clinic.city}, {clinic.state}</span>
                            <span style={{ fontWeight: "600" }}>License:</span><span>{clinic.licenseNumber}</span>
                            <span style={{ fontWeight: "600" }}>Experience:</span><span>{clinic.experienceYears} years</span>
                            <span style={{ fontWeight: "600" }}>Description:</span><span>{clinic.description}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Doctors Section */}
            <div>
                <h3 style={{ textAlign: "center", color: "#004d40", fontSize: "28px", fontWeight: "600", marginBottom: "30px" }}>Our Expert Doctors</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px" }}>
                    {doctors.length > 0 ? (
                        doctors.map((doctor) => (
                            <div
                                key={doctor._id}
                                style={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: "15px",
                                    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
                                    padding: "25px",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    cursor: "pointer",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-10px)", e.currentTarget.style.boxShadow = "0 12px 25px rgba(0, 0, 0, 0.15)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)", e.currentTarget.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.1)")}
                            >
                                <h5 style={{ color: "#00796b", fontSize: "22px", fontWeight: "600", marginBottom: "15px" }}>
                                    {Array.isArray(doctor.DoctorName) ? doctor.DoctorName[0] : doctor.DoctorName}
                                </h5>
                                <p style={{ color: "#555", fontSize: "16px", marginBottom: "10px" }}><strong>Qualification:</strong> {doctor.qualification}</p>
                                <p style={{ color: "#555", fontSize: "16px", marginBottom: "10px" }}><strong>Specialization:</strong> {doctor.specialization}</p>
                                <p style={{ color: "#555", fontSize: "16px", marginBottom: "10px" }}><strong>Phone:</strong> {doctor.phone}</p>
                                <p style={{ color: "#555", fontSize: "16px", marginBottom: "10px" }}><strong>Experience:</strong> {doctor.experience} years</p>
                                <p style={{ color: "#555", fontSize: "16px", marginBottom: "20px" }}><strong>Availability:</strong> {doctor.availability}</p>
                                <button
                                    style={{
                                        backgroundColor: "#00796b",
                                        color: "#fff",
                                        padding: "12px 20px",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        width: "100%",
                                        fontSize: "16px",
                                        fontWeight: "500",
                                        transition: "background-color 0.3s ease",
                                    }}
                                    onClick={() => handleBookNow(doctor)}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#004d40")}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00796b")}
                                >
                                    Book Now
                                </button>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: "center", color: "#777", fontSize: "18px", padding: "20px" }}>No doctors available.</p>
                    )}
                </div>
            </div>

            {/* Booking Modal */}
            {selectedDoctor && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
                    <div style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "20px", width: "90%", maxWidth: "700px", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)", maxHeight: "90vh", overflowY: "auto" }}>
                        <h4 style={{ color: "#004d40", fontSize: "28px", fontWeight: "600", marginBottom: "20px", textAlign: "center" }}>
                            Book Appointment with {Array.isArray(selectedDoctor.DoctorName) ? selectedDoctor.DoctorName[0] : selectedDoctor.DoctorName}
                        </h4>
                        <div style={{ backgroundColor: "#e0f7fa", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
                            <p style={{ margin: "0", fontSize: "16px", color: "#00796b", fontWeight: "500" }}>
                                <strong>Doctor Availability:</strong> {selectedDoctor.availability}
                            </p>
                        </div>
                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                            tileClassName={tileClassName}
                            minDate={new Date()}
                            style={{ border: "none", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}
                        />
                        <div style={{ marginTop: "15px", fontSize: "14px", color: "#555", textAlign: "center" }}>
                            <p><span style={{ color: "#ff6f61", fontWeight: "bold" }}>Red:</span> Weekends (Not Available)</p>
                            <p><span style={{ color: "#00796b", fontWeight: "bold" }}>Teal:</span> Available Weekdays</p>
                        </div>
                        {selectedDate && (
                            <div style={{ marginTop: "25px" }}>
                                <h5 style={{ color: "#004d40", fontSize: "20px", fontWeight: "600", marginBottom: "15px" }}>Select Time Slot</h5>
                                {availableSlots.length > 0 ? (
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "15px" }}>
                                        {availableSlots.map((slot) => (
                                            <div
                                                key={slot}
                                                onClick={() => handleTimeSlotChange(slot)}
                                                style={{
                                                    padding: "12px",
                                                    border: `2px solid ${selectedTime === slot ? "#00796b" : "#ddd"}`,
                                                    backgroundColor: selectedTime === slot ? "#e0f7fa" : "#fff",
                                                    borderRadius: "8px",
                                                    textAlign: "center",
                                                    cursor: "pointer",
                                                    fontSize: "16px",
                                                    color: "#004d40",
                                                    transition: "all 0.3s ease",
                                                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.15)")}
                                                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)")}
                                            >
                                                {slot}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: "#ff6f61", fontSize: "16px", textAlign: "center" }}>No time slots available for this date.</p>
                                )}
                            </div>
                        )}
                        <div style={{ display: "flex", gap: "15px", marginTop: "30px", justifyContent: "center" }}>
                            <button
                                style={{
                                    backgroundColor: "#ff6f61",
                                    color: "#fff",
                                    padding: "12px 25px",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    transition: "background-color 0.3s ease",
                                    minWidth: "120px",
                                }}
                                onClick={() => setSelectedDoctor(null)}
                                disabled={loading}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e65b50")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ff6f61")}
                            >
                                Cancel
                            </button>
                            <button
                                style={{
                                    backgroundColor: "#00796b",
                                    color: "#fff",
                                    padding: "12px 25px",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: selectedDate && selectedTime && !loading ? "pointer" : "not-allowed",
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    transition: "background-color 0.3s ease",
                                    opacity: selectedDate && selectedTime && !loading ? 1 : 0.6,
                                    minWidth: "120px",
                                }}
                                disabled={!selectedDate || !selectedTime || loading}
                                onClick={handleConfirmBooking}
                                onMouseEnter={(e) => selectedDate && selectedTime && !loading && (e.currentTarget.style.backgroundColor = "#004d40")}
                                onMouseLeave={(e) => selectedDate && selectedTime && !loading && (e.currentTarget.style.backgroundColor = "#00796b")}
                            >
                                {loading ? "Processing..." : "Confirm Booking"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClinicDetails;