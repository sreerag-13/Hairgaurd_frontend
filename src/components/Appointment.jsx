import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import DoctorNav from "./DoctorNav";

const socket = io("http://localhost:3031");

const Appointment = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [notification, setNotification] = useState(null);

    const clinicId = sessionStorage.getItem("_id");

    useEffect(() => {
        if (!clinicId) {
            setError("No clinic ID found. Please log in again.");
            setLoading(false);
            return;
        }

        const fetchBookings = async () => {
            try {
                const response = await axios.get(`http://localhost:3031/clinic-bookings/${clinicId}`);
                if (response.data.status === "success") {
                    setBookings(response.data.data);
                } else {
                    setError(response.data.message || "Failed to fetch bookings");
                }
            } catch (err) {
                console.error("Error fetching bookings:", err);
                setError("An error occurred while fetching bookings");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();

        return () => {
            socket.disconnect();
        };
    }, [clinicId]);

    useEffect(() => {
        if (selectedBooking) {
            socket.emit("joinChat", selectedBooking._id);
            socket.on("newMessage", (message) => {
                if (message.bookingId === selectedBooking._id) {
                    setMessages((prev) => [...prev, message]);
                } else {
                    setNotification(`New message from ${message.senderId.UName || "User"}`);
                    setTimeout(() => setNotification(null), 3000);
                }
            });
        }

        return () => {
            socket.off("newMessage");
        };
    }, [selectedBooking]);

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            const response = await axios.put(`http://localhost:3031/clinic-booking/update/${bookingId}`, { status: newStatus });
            if (response.data.status === "success") {
                setBookings((prevBookings) =>
                    prevBookings.map((booking) =>
                        booking._id === bookingId ? { ...booking, status: newStatus } : booking
                    )
                );
                alert(`Booking ${newStatus} successfully`);
            } else {
                setError(response.data.message || "Failed to update booking status");
            }
        } catch (err) {
            console.error("Error updating booking status:", err);
            setError("An error occurred while updating the booking status");
        }
    };

    const fetchMessages = async (bookingId) => {
        try {
            const response = await axios.get(`http://localhost:3031/messages/${bookingId}`);
            if (response.data.status === "success") {
                setMessages(response.data.data);
            } else {
                setError(response.data.message || "Failed to fetch messages");
            }
        } catch (err) {
            console.error("Error fetching messages:", err);
            setError("An error occurred while fetching messages");
        }
    };

    const sendMessage = async (bookingId, userId) => {
        if (!newMessage.trim()) return;
        try {
            const response = await axios.post(`http://localhost:3031/messages`, {
                bookingId,
                senderId: clinicId,
                receiverId: userId,
                senderType: "Clinic",
                receiverType: "user",
                message: newMessage,
            });
            if (response.data.status === "success") {
                setNewMessage("");
            } else {
                setError(response.data.message || "Failed to send message");
            }
        } catch (err) {
            console.error("Error sending message:", err);
            setError("An error occurred while sending the message");
        }
    };

    const openChat = (booking) => {
        setSelectedBooking(booking);
        fetchMessages(booking._id);
    };

    return (
        <div
            style={{
                display: 'flex',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #eef2f3 0%, #e6e9f0 100%)',
                fontFamily: "'Roboto', sans-serif",
            }}
        >
            <DoctorNav />
            <div
                style={{
                    marginLeft: '250px',
                    flex: 1,
                    padding: '40px 20px',
                    overflowY: 'auto',
                    width: 'calc(100vw - 250px)',
                }}
            >
                {loading ? (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            fontSize: '1.5rem',
                            color: '#34495e',
                        }}
                    >
                        Loading...
                    </div>
                ) : error ? (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            fontSize: '1.5rem',
                            color: '#e74c3c',
                        }}
                    >
                        {error}
                    </div>
                ) : (
                    <div
                        style={{
                            maxWidth: '1100px',
                            width: '100%',
                            background: '#ffffff',
                            borderRadius: '20px',
                            padding: '40px',
                            margin: '0 auto',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                            border: '1px solid #e0e6ed',
                        }}
                    >
                        <h2
                            style={{
                                textAlign: 'center',
                                color: '#1e2a44',
                                fontSize: '2.5rem',
                                fontWeight: '700',
                                marginBottom: '40px',
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase',
                            }}
                        >
                            Clinic Appointments
                        </h2>
                        {notification && (
                            <div
                                style={{
                                    position: 'fixed',
                                    top: '20px',
                                    right: '20px',
                                    background: '#1e2a44',
                                    color: '#fff',
                                    padding: '15px 20px',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 15px rgba(30, 42, 68, 0.3)',
                                    zIndex: 1000,
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    transition: 'opacity 0.3s ease',
                                }}
                            >
                                {notification}
                            </div>
                        )}
                        {bookings.length === 0 ? (
                            <p
                                style={{
                                    textAlign: 'center',
                                    fontSize: '1.5rem',
                                    color: '#7f8c8d',
                                    margin: '40px 0',
                                }}
                            >
                                No appointments found.
                            </p>
                        ) : (
                            <div
                                style={{
                                    overflowX: 'auto',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                }}
                            >
                                <table
                                    style={{
                                        width: '100%',
                                        borderCollapse: 'separate',
                                        borderSpacing: 0,
                                        background: '#fff',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <thead>
                                        <tr
                                            style={{
                                                background: '#1e2a44',
                                                color: '#fff',
                                            }}
                                        >
                                            <th style={{ padding: '15px', fontWeight: '600', textAlign: 'left' }}>User Name</th>
                                            <th style={{ padding: '15px', fontWeight: '600', textAlign: 'left' }}>Doctor Name</th>
                                            <th style={{ padding: '15px', fontWeight: '600', textAlign: 'left' }}>Date</th>
                                            <th style={{ padding: '15px', fontWeight: '600', textAlign: 'left' }}>Time</th>
                                            <th style={{ padding: '15px', fontWeight: '600', textAlign: 'left' }}>Treatment</th>
                                            <th style={{ padding: '15px', fontWeight: '600', textAlign: 'left' }}>Status</th>
                                            <th style={{ padding: '15px', fontWeight: '600', textAlign: 'center' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map((booking, index) => (
                                            <tr
                                                key={booking._id}
                                                style={{
                                                    background: index % 2 === 0 ? '#f9fafc' : '#fff',
                                                    transition: 'background 0.3s ease',
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.background = '#eef2f3')}
                                                onMouseLeave={(e) => (e.currentTarget.style.background = index % 2 === 0 ? '#f9fafc' : '#fff')}
                                            >
                                                <td style={{ padding: '15px', color: '#34495e' }}>
                                                    {booking.userId?.UName || booking.userName}
                                                </td>
                                                <td style={{ padding: '15px', color: '#34495e' }}>
                                                    {booking.doctorId?.DoctorName[0] || booking.doctorName}
                                                </td>
                                                <td style={{ padding: '15px', color: '#34495e' }}>
                                                    {new Date(booking.bookingDate).toLocaleDateString()}
                                                </td>
                                                <td style={{ padding: '15px', color: '#34495e' }}>{booking.slotTime}</td>
                                                <td style={{ padding: '15px', color: '#34495e' }}>{booking.treatmentType}</td>
                                                <td
                                                    style={{
                                                        padding: '15px',
                                                        color:
                                                            booking.status === "confirmed"
                                                                ? "#28a745"
                                                                : booking.status === "cancelled"
                                                                ? "#e74c3c"
                                                                : "#f1c40f",
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    {booking.status}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: '15px',
                                                        textAlign: 'center',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        gap: '10px',
                                                    }}
                                                >
                                                    {booking.status === "pending" ? (
                                                        <>
                                                            <button
                                                                style={{
                                                                    padding: '8px 20px',
                                                                    background: '#28a745',
                                                                    color: '#fff',
                                                                    border: 'none',
                                                                    borderRadius: '8px',
                                                                    fontSize: '1rem',
                                                                    fontWeight: '500',
                                                                    cursor: 'pointer',
                                                                    transition: 'background 0.3s ease, transform 0.3s ease',
                                                                    boxShadow: '0 2px 10px rgba(40, 167, 69, 0.2)',
                                                                }}
                                                                onClick={() => handleStatusUpdate(booking._id, "confirmed")}
                                                                onMouseEnter={(e) => {
                                                                    e.target.style.background = '#218838';
                                                                    e.target.style.transform = 'scale(1.05)';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.target.style.background = '#28a745';
                                                                    e.target.style.transform = 'scale(1)';
                                                                }}
                                                            >
                                                                Accept
                                                            </button>
                                                            <button
                                                                style={{
                                                                    padding: '8px 20px',
                                                                    background: '#e74c3c',
                                                                    color: '#fff',
                                                                    border: 'none',
                                                                    borderRadius: '8px',
                                                                    fontSize: '1rem',
                                                                    fontWeight: '500',
                                                                    cursor: 'pointer',
                                                                    transition: 'background 0.3s ease, transform 0.3s ease',
                                                                    boxShadow: '0 2px 10px rgba(231, 76, 60, 0.2)',
                                                                }}
                                                                onClick={() => handleStatusUpdate(booking._id, "cancelled")}
                                                                onMouseEnter={(e) => {
                                                                    e.target.style.background = '#c0392b';
                                                                    e.target.style.transform = 'scale(1.05)';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.target.style.background = '#e74c3c';
                                                                    e.target.style.transform = 'scale(1)';
                                                                }}
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    ) : booking.status === "confirmed" ? (
                                                        <button
                                                            style={{
                                                                padding: '8px 20px',
                                                                background: '#3498db',
                                                                color: '#fff',
                                                                border: 'none',
                                                                borderRadius: '8px',
                                                                fontSize: '1rem',
                                                                fontWeight: '500',
                                                                cursor: 'pointer',
                                                                transition: 'background 0.3s ease, transform 0.3s ease',
                                                                boxShadow: '0 2px 10px rgba(52, 152, 219, 0.2)',
                                                            }}
                                                            onClick={() => openChat(booking)}
                                                            onMouseEnter={(e) => {
                                                                e.target.style.background = '#2980b9';
                                                                e.target.style.transform = 'scale(1.05)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.background = '#3498db';
                                                                e.target.style.transform = 'scale(1)';
                                                            }}
                                                        >
                                                            Chat
                                                        </button>
                                                    ) : null}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {selectedBooking && (
                            <div
                                style={{
                                    position: 'fixed',
                                    bottom: '30px',
                                    right: '30px',
                                    width: '400px',
                                    height: '500px',
                                    background: '#fff',
                                    borderRadius: '20px',
                                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden',
                                    zIndex: 1000,
                                }}
                            >
                                <div
                                    style={{
                                        background: '#1e2a44',
                                        color: '#fff',
                                        padding: '15px 20px',
                                        borderTopLeftRadius: '20px',
                                        borderTopRightRadius: '20px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <h3
                                        style={{
                                            margin: 0,
                                            fontSize: '1.3rem',
                                            fontWeight: '600',
                                        }}
                                    >
                                        Chat with {selectedBooking.userId?.UName || selectedBooking.userName}
                                    </h3>
                                    <button
                                        style={{
                                            background: '#e74c3c',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '6px 12px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            transition: 'background 0.3s ease',
                                        }}
                                        onClick={() => setSelectedBooking(null)}
                                        onMouseEnter={(e) => (e.target.style.background = '#c0392b')}
                                        onMouseLeave={(e) => (e.target.style.background = '#e74c3c')}
                                    >
                                        Close
                                    </button>
                                </div>
                                <div
                                    style={{
                                        flex: 1,
                                        padding: '15px',
                                        overflowY: 'auto',
                                        background: '#ECE5DD',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px',
                                    }}
                                >
                                    {messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                maxWidth: '70%',
                                                padding: '10px 15px',
                                                borderRadius: '10px',
                                                background: msg.senderId.toString() === clinicId ? '#1e2a44' : '#fff',
                                                color: msg.senderId.toString() === clinicId ? '#fff' : '#34495e',
                                                alignSelf: msg.senderId.toString() === clinicId ? 'flex-end' : 'flex-start',
                                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                                position: 'relative',
                                            }}
                                        >
                                            <span style={{ fontWeight: '600', marginRight: '5px' }}>
                                                {msg.senderId.UName || msg.senderId.clinicName}:
                                            </span>
                                            <span>{msg.message}</span>
                                            <span
                                                style={{
                                                    fontSize: '0.75rem',
                                                    display: 'block',
                                                    marginTop: '5px',
                                                    opacity: 0.7,
                                                    textAlign: 'right',
                                                }}
                                            >
                                                {new Date(msg.createdAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        padding: '15px',
                                        borderTop: '1px solid #e0e6ed',
                                        background: '#f9fafc',
                                    }}
                                >
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        style={{
                                            flex: 1,
                                            padding: '12px 15px',
                                            borderRadius: '10px',
                                            border: '1px solid #d1d9e6',
                                            fontSize: '1rem',
                                            color: '#34495e',
                                            marginRight: '10px',
                                            background: '#fff',
                                            transition: 'border-color 0.3s ease',
                                        }}
                                        onFocus={(e) => (e.target.style.borderColor = '#3498db')}
                                        onBlur={(e) => (e.target.style.borderColor = '#d1d9e6')}
                                        onKeyPress={(e) =>
                                            e.key === "Enter" && sendMessage(selectedBooking._id, selectedBooking.userId._id)
                                        }
                                    />
                                    <button
                                        style={{
                                            padding: '12px 20px',
                                            background: '#1e2a44',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '10px',
                                            fontSize: '1rem',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'background 0.3s ease, transform 0.3s ease',
                                            boxShadow: '0 2px 10px rgba(30, 42, 68, 0.2)',
                                        }}
                                        onClick={() => sendMessage(selectedBooking._id, selectedBooking.userId._id)}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = '#3498db';
                                            e.target.style.transform = 'scale(1.05)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = '#1e2a44';
                                            e.target.style.transform = 'scale(1)';
                                        }}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Appointment;