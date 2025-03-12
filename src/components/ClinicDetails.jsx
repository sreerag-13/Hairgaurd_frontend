import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const ClinicDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [clinic, setClinic] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedTreatment, setSelectedTreatment] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const BASE_URL = "http://localhost:3031";

    const [currentUser] = useState({
        userId: sessionStorage.getItem("userId"),
        userName: sessionStorage.getItem("userName") || "Guest",
    });

    const treatmentOptions = [
        "PRP Therapy (Platelet-Rich Plasma)",
        "Hair Transplant (FUE/FUT)",
        "Minoxidil & Finasteride Therapy",
        "Anti-Dandruff Treatment",
        "Scalp Detox & Exfoliation",
        "Laser Hair Therapy (LLLT)",
        "Alopecia Areata Treatment"
    ];

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
        setSelectedTreatment("");
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

    const handleTreatmentChange = (e) => {
        setSelectedTreatment(e.target.value);
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
        if (!selectedDate || !selectedTime || !selectedTreatment || !selectedDoctor) {
            alert("Please select a date, time slot, and treatment type");
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
                treatmentType: selectedTreatment,
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
                    setSelectedTreatment("");
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

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    const tileClassName = ({ date, view }) => {
        if (view === "month") {
            const day = date.getDay();
            if (day === 0 || day === 6) {
                return { style: { backgroundColor: "#ff4444", color: "#fff", borderRadius: "50%", fontWeight: "bold" } };
            }
            return { style: { backgroundColor: "#e6f0fa", color: "#2c3e50", borderRadius: "50%", fontWeight: "bold" } };
        }
    };

    if (!clinic) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "linear-gradient(135deg, #ecf0f1 0%, #dfe4ea 100%)"
            }}>
                <p style={{ fontSize: "1.5rem", color: "#2c3e50", fontWeight: "600" }}>Loading clinic details...</p>
            </div>
        );
    }

    const imageUrl = clinic.image?.startsWith("/") ? `${BASE_URL}${clinic.image}` : clinic.image || "https://via.placeholder.com/150";

    return (
        <div style={{
            background: 'linear-gradient(135deg, #ecf0f1 0%, #dfe4ea 100%)',
            minHeight: '100vh',
            padding: '40px 20px',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <div style={{
                maxWidth: '1400px',
                width: '100%',
                position: 'relative'
            }}>
                {/* Back Button */}
                <button
                    onClick={handleBack}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        padding: '12px 20px',
                        background: '#2c3e50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.3s ease, transform 0.2s, box-shadow 0.3s ease',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                        zIndex: 10
                    }}
                    onMouseEnter={(e) => { e.target.style.background = '#34495e'; e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.25)'; }}
                    onMouseLeave={(e) => { e.target.style.background = '#2c3e50'; e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)'; }}
                >
                    ← Back
                </button>

                {/* Clinic Header */}
                <div style={{
                    background: '#fff',
                    borderRadius: '20px',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                    padding: '40px',
                    marginTop: '60px',
                    marginBottom: '50px',
                    border: '2px solid #2c3e50'
                }}>
                    <h2 style={{
                        color: '#2c3e50',
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        textAlign: 'center',
                        marginBottom: '30px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        {clinic.clinicName}
                    </h2>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '50px',
                        flexWrap: 'wrap'
                    }}>
                        <img
                            src={imageUrl}
                            alt={clinic.clinicName}
                            style={{
                                width: '280px',
                                height: '280px',
                                objectFit: 'cover',
                                borderRadius: '15px',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #34495e'
                            }}
                            onError={(e) => (e.target.src = "https://via.placeholder.com/280")}
                        />
                        <div style={{
                            flex: '1',
                            minWidth: '300px'
                        }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 2fr',
                                gap: '20px',
                                fontSize: '1.2rem',
                                color: '#34495e'
                            }}>
                                <span style={{ fontWeight: '600', color: '#2c3e50' }}>Email:</span><span>{clinic.email}</span>
                                <span style={{ fontWeight: '600', color: '#2c3e50' }}>Phone:</span><span>{clinic.phone}</span>
                                <span style={{ fontWeight: '600', color: '#2c3e50' }}>Address:</span><span>{clinic.address}, {clinic.city}, {clinic.state}</span>
                                <span style={{ fontWeight: '600', color: '#2c3e50' }}>License:</span><span>{clinic.licenseNumber}</span>
                                <span style={{ fontWeight: '600', color: '#2c3e50' }}>Experience:</span><span>{clinic.experienceYears} years</span>
                                <span style={{ fontWeight: '600', color: '#2c3e50' }}>Description:</span><span>{clinic.description}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Doctors Section */}
                <div>
                    <h3 style={{
                        textAlign: 'center',
                        color: '#2c3e50',
                        fontSize: '2rem',
                        fontWeight: '700',
                        marginBottom: '40px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Our Expert Doctors
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                        gap: '35px'
                    }}>
                        {doctors.length > 0 ? (
                            doctors.map((doctor) => (
                                <div
                                    key={doctor._id}
                                    style={{
                                        background: '#fff',
                                        borderRadius: '20px',
                                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                                        padding: '30px',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        cursor: 'pointer',
                                        border: '2px solid #2c3e50'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.25)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)'; }}
                                >
                                    <h5 style={{
                                        color: '#2c3e50',
                                        fontSize: '1.6rem',
                                        fontWeight: '700',
                                        marginBottom: '15px',
                                        textTransform: 'uppercase'
                                    }}>
                                        {Array.isArray(doctor.DoctorName) ? doctor.DoctorName[0] : doctor.DoctorName}
                                    </h5>
                                    <p style={{ color: '#34495e', fontSize: '1.1rem', marginBottom: '12px' }}><strong style={{ color: '#2c3e50' }}>Qualification:</strong> {doctor.qualification}</p>
                                    <p style={{ color: '#34495e', fontSize: '1.1rem', marginBottom: '12px' }}><strong style={{ color: '#2c3e50' }}>Specialization:</strong> {doctor.specialization}</p>
                                    <p style={{ color: '#34495e', fontSize: '1.1rem', marginBottom: '12px' }}><strong style={{ color: '#2c3e50' }}>Phone:</strong> {doctor.phone}</p>
                                    <p style={{ color: '#34495e', fontSize: '1.1rem', marginBottom: '12px' }}><strong style={{ color: '#2c3e50' }}>Experience:</strong> {doctor.experience} years</p>
                                    <p style={{ color: '#34495e', fontSize: '1.1rem', marginBottom: '20px' }}><strong style={{ color: '#2c3e50' }}>Availability:</strong> {doctor.availability}</p>
                                    <button
                                        style={{
                                            background: '#2c3e50',
                                            color: '#fff',
                                            padding: '14px 25px',
                                            border: 'none',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            width: '100%',
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            transition: 'background 0.3s ease, transform 0.2s, box-shadow 0.3s ease',
                                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
                                        }}
                                        onClick={() => handleBookNow(doctor)}
                                        onMouseEnter={(e) => { e.target.style.background = '#34495e'; e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.25)'; }}
                                        onMouseLeave={(e) => { e.target.style.background = '#2c3e50'; e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)'; }}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p style={{
                                textAlign: 'center',
                                color: '#34495e',
                                fontSize: '1.5rem',
                                padding: '40px',
                                background: '#fff',
                                borderRadius: '20px',
                                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                                border: '2px solid #2c3e50'
                            }}>
                                No doctors available.
                            </p>
                        )}
                    </div>
                </div>

                {/* Booking Modal */}
                {selectedDoctor && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            background: '#fff',
                            padding: '40px',
                            borderRadius: '20px',
                            width: '90%',
                            maxWidth: '900px',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25)',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            border: '2px solid #2c3e50'
                        }}>
                            <h4 style={{
                                color: '#2c3e50',
                                fontSize: '2rem',
                                fontWeight: '700',
                                marginBottom: '25px',
                                textAlign: 'center',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                Book Appointment with {Array.isArray(selectedDoctor.DoctorName) ? selectedDoctor.DoctorName[0] : selectedDoctor.DoctorName}
                            </h4>
                            <div style={{
                                background: '#f9fbfc',
                                padding: '20px',
                                borderRadius: '12px',
                                marginBottom: '25px',
                                border: '1px solid #34495e'
                            }}>
                                <p style={{
                                    margin: 0,
                                    fontSize: '1.2rem',
                                    color: '#34495e',
                                    fontWeight: '500'
                                }}>
                                    <strong style={{ color: '#2c3e50' }}>Doctor Availability:</strong> {selectedDoctor.availability}
                                </p>
                            </div>
                            <Calendar
                                onChange={handleDateChange}
                                value={selectedDate}
                                tileClassName={tileClassName}
                                minDate={new Date()}
                                style={{
                                    border: '1px solid #34495e',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                                    background: '#fff'
                                }}
                            />
                            <div style={{
                                marginTop: '20px',
                                fontSize: '1rem',
                                color: '#34495e',
                                textAlign: 'center'
                            }}>
                                <p><span style={{ color: '#ff4444', fontWeight: 'bold' }}>Red:</span> Weekends (Not Available)</p>
                                <p><span style={{ color: '#2c3e50', fontWeight: 'bold' }}>Blue:</span> Available Weekdays</p>
                            </div>
                            {selectedDate && (
                                <div style={{ marginTop: '30px' }}>
                                    <h5 style={{
                                        color: '#2c3e50',
                                        fontSize: '1.5rem',
                                        fontWeight: '600',
                                        marginBottom: '20px'
                                    }}>
                                        Select Time Slot
                                    </h5>
                                    {availableSlots.length > 0 ? (
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                                            gap: '20px'
                                        }}>
                                            {availableSlots.map((slot) => (
                                                <div
                                                    key={slot}
                                                    onClick={() => handleTimeSlotChange(slot)}
                                                    style={{
                                                        padding: '14px',
                                                        border: `2px solid ${selectedTime === slot ? '#3498db' : '#34495e'}`,
                                                        background: selectedTime === slot ? '#e6f0fa' : '#fff',
                                                        borderRadius: '10px',
                                                        textAlign: 'center',
                                                        cursor: 'pointer',
                                                        fontSize: '1.1rem',
                                                        color: '#2c3e50',
                                                        transition: 'all 0.3s ease',
                                                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.15)'}
                                                    onMouseLeave={(e) => e.target.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)'}
                                                >
                                                    {slot}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{
                                            color: '#ff4444',
                                            fontSize: '1.2rem',
                                            textAlign: 'center'
                                        }}>
                                            No time slots available for this date.
                                        </p>
                                    )}
                                </div>
                            )}
                            {selectedTime && (
                                <div style={{ marginTop: '30px' }}>
                                    <h5 style={{
                                        color: '#2c3e50',
                                        fontSize: '1.5rem',
                                        fontWeight: '600',
                                        marginBottom: '20px'
                                    }}>
                                        Select Treatment Type
                                    </h5>
                                    <select
                                        value={selectedTreatment}
                                        onChange={handleTreatmentChange}
                                        style={{
                                            width: '100%',
                                            padding: '14px',
                                            borderRadius: '12px',
                                            border: '2px solid #34495e',
                                            fontSize: '1.1rem',
                                            color: '#2c3e50',
                                            background: '#f9fbfc',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                                            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                            appearance: 'none',
                                            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%232c3e50\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 14px center',
                                            backgroundSize: '18px'
                                        }}
                                        onFocus={(e) => { e.target.style.borderColor = '#3498db'; e.target.style.boxShadow = '0 4px 15px rgba(52, 152, 219, 0.2)'; }}
                                        onBlur={(e) => { e.target.style.borderColor = '#34495e'; e.target.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)'; }}
                                    >
                                        <option value="">-- Select Treatment Type --</option>
                                        {treatmentOptions.map((treatment) => (
                                            <option key={treatment} value={treatment}>{treatment}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div style={{
                                display: 'flex',
                                gap: '20px',
                                marginTop: '40px',
                                justifyContent: 'center'
                            }}>
                                <button
                                    style={{
                                        background: '#ff4444',
                                        color: '#fff',
                                        padding: '14px 30px',
                                        border: 'none',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        fontSize: '1.1rem',
                                        fontWeight: '600',
                                        transition: 'background 0.3s ease, transform 0.2s, box-shadow 0.3s ease',
                                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                                        minWidth: '140px'
                                    }}
                                    onClick={() => setSelectedDoctor(null)}
                                    disabled={loading}
                                    onMouseEnter={(e) => { e.target.style.background = '#cc3333'; e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.25)'; }}
                                    onMouseLeave={(e) => { e.target.style.background = '#ff4444'; e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)'; }}
                                >
                                    Cancel
                                </button>
                                <button
                                    style={{
                                        background: '#2c3e50',
                                        color: '#fff',
                                        padding: '14px 30px',
                                        border: 'none',
                                        borderRadius: '12px',
                                        cursor: selectedDate && selectedTime && selectedTreatment && !loading ? 'pointer' : 'not-allowed',
                                        fontSize: '1.1rem',
                                        fontWeight: '600',
                                        transition: 'background 0.3s ease, transform 0.2s, box-shadow 0.3s ease',
                                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                                        opacity: selectedDate && selectedTime && selectedTreatment && !loading ? 1 : 0.6,
                                        minWidth: '140px'
                                    }}
                                    disabled={!selectedDate || !selectedTime || !selectedTreatment || loading}
                                    onClick={handleConfirmBooking}
                                    onMouseEnter={(e) => selectedDate && selectedTime && selectedTreatment && !loading && (e.target.style.background = '#34495e', e.target.style.transform = 'scale(1.05)', e.target.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.25)')}
                                    onMouseLeave={(e) => selectedDate && selectedTime && selectedTreatment && !loading && (e.target.style.background = '#2c3e50', e.target.style.transform = 'scale(1)', e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)')}
                                >
                                    {loading ? "Processing..." : "Confirm Booking"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClinicDetails;