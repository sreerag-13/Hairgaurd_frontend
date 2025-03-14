import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from 'react-router-dom';

const socket = io("http://localhost:3031"); // Connect to backend

const UserAppointment = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [notification, setNotification] = useState(null);

    const userId = sessionStorage.getItem("userId");
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            setError("No user ID found. Please log in again.");
            setLoading(false);
            return;
        }

        const fetchUserBookings = async () => {
            try {
                const response = await axios.get(`http://localhost:3031/user-bookings/${userId}`);
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

        fetchUserBookings();

        return () => {
            socket.disconnect(); // Cleanup on unmount
        };
    }, [userId]);

    useEffect(() => {
        if (selectedBooking) {
            socket.emit("joinChat", selectedBooking._id);
            socket.on("newMessage", (message) => {
                if (message.bookingId === selectedBooking._id) {
                    setMessages((prev) => [...prev, message]);
                } else {
                    setNotification(`New message in booking with ${message.clinicName || "Clinic"}`);
                    setTimeout(() => setNotification(null), 3000); // Clear after 3s
                }
            });
        }

        return () => {
            socket.off("newMessage");
        };
    }, [selectedBooking]);

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

    const sendMessage = async (bookingId, clinicId) => {
        if (!newMessage.trim()) return;
        try {
            const response = await axios.post(`http://localhost:3031/messages`, {
                bookingId,
                senderId: userId,
                receiverId: clinicId,
                senderType: "user",
                receiverType: "Clinic",
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

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loader}></div>
                <span>Loading Appointments...</span>
            </div>
        );
    }

    if (error) {
        return <div style={styles.errorContainer}>{error}</div>;
    }

    return (
        <div style={styles.appContainer}>
            {/* Navbar */}
            <div style={styles.navbar}>
                <h2 style={styles.navTitle}>HairGuard</h2>
                <ul style={styles.navList}>
                    <li style={styles.navItem} onClick={() => navigate('/UserDash')}>Home</li>
                    <li style={styles.navItem} onClick={() => navigate('/UserAppointment')}>Your Appointments</li>
                    <li style={styles.navItem} onClick={() => navigate('/UserProfile')}>Profile</li>
                    <li style={styles.navItem} onClick={() => navigate('/UserCart')}>Booked Product</li>
                </ul>
            </div>

            {/* Main Content */}
            <div style={styles.container}>
                <h2 style={styles.header}>Your Booked Appointments</h2>
                {notification && <div style={styles.notification}>{notification}</div>}
                {bookings.length === 0 ? (
                    <div style={styles.noDataContainer}>
                        <p style={styles.noData}>No appointments booked yet.</p>
                        <button style={styles.bookNowButton} onClick={() => navigate('/UserDash')}>
                            Book Now
                        </button>
                    </div>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Clinic Name</th>
                                    <th style={styles.th}>Doctor Name</th>
                                    <th style={styles.th}>Date</th>
                                    <th style={styles.th}>Time</th>
                                    <th style={styles.th}>Treatment</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr key={booking._id} style={styles.tr}>
                                        <td style={styles.td}>{booking.clinicName}</td>
                                        <td style={styles.td}>{booking.doctorId?.DoctorName[0] || booking.doctorName}</td>
                                        <td style={styles.td}>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                                        <td style={styles.td}>{booking.slotTime}</td>
                                        <td style={styles.td}>{booking.treatmentType}</td>
                                        <td
                                            style={{
                                                ...styles.td,
                                                color:
                                                    booking.status === "confirmed"
                                                        ? "#27ae60"
                                                        : booking.status === "cancelled"
                                                        ? "#e74c3c"
                                                        : "#f39c12",
                                            }}
                                        >
                                            {booking.status}
                                        </td>
                                        <td style={styles.td}>
                                            {booking.status === "confirmed" && (
                                                <button
                                                    style={styles.chatButton}
                                                    onClick={() => openChat(booking)}
                                                >
                                                    Chat
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedBooking && (
                    <div style={styles.chatContainer}>
                        <div style={styles.chatHeader}>
                            <h3 style={styles.chatTitle}>Chat with {selectedBooking.clinicName}</h3>
                            <button style={styles.closeButton} onClick={() => setSelectedBooking(null)}>
                                ×
                            </button>
                        </div>
                        <div style={styles.chatMessages}>
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    style={{
                                        ...styles.message,
                                        alignSelf: msg.senderId.toString() === userId ? "flex-end" : "flex-start",
                                        backgroundColor: msg.senderId.toString() === userId ? "#2ecc71" : "#ecf0f1",
                                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                    }}
                                >
                                    <span style={styles.senderName}>
                                        {msg.senderId.UName || msg.senderId.clinicName}
                                    </span>
                                    <span style={styles.messageText}>{msg.message}</span>
                                    <span style={styles.timestamp}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div style={styles.chatInput}>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                style={styles.input}
                                placeholder="Type your message..."
                                onKeyPress={(e) =>
                                    e.key === "Enter" && sendMessage(selectedBooking._id, selectedBooking.clinicId)
                                }
                            />
                            <button
                                style={styles.sendButton}
                                onClick={() => sendMessage(selectedBooking._id, selectedBooking.clinicId)}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    appContainer: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f4f8 0%, #dfe4ea 100%)',
        fontFamily: "'Poppins', sans-serif",
    },
    navbar: {
        backgroundColor: '#2c3e50',
        padding: '15px 30px',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
    },
    navTitle: {
        margin: 0,
        fontSize: '28px',
        fontWeight: '600',
        letterSpacing: '1px',
    },
    navList: {
        listStyle: 'none',
        padding: 0,
        display: 'flex',
        gap: '25px',
        margin: 0,
    },
    navItem: {
        cursor: 'pointer',
        padding: '12px 20px',
        borderRadius: '6px',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        fontSize: '16px',
        fontWeight: '500',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        ':hover': {
            backgroundColor: '#34495e',
            transform: 'translateY(-2px)',
        },
    },
    container: {
        padding: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        flex: 1,
    },
    header: {
        fontSize: '34px',
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: '40px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '20px',
        color: '#2c3e50',
    },
    loader: {
        width: '40px',
        height: '40px',
        border: '5px solid #2c3e50',
        borderTop: '5px solid transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '15px',
    },
    errorContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '20px',
        color: '#e74c3c',
        textAlign: 'center',
        padding: '20px',
    },
    noDataContainer: {
        textAlign: 'center',
        padding: '50px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    },
    noData: {
        fontSize: '20px',
        color: '#7f8c8d',
        marginBottom: '20px',
    },
    bookNowButton: {
        backgroundColor: '#2ecc71',
        color: '#fff',
        padding: '12px 25px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        ':hover': {
            backgroundColor: '#27ae60',
            transform: 'scale(1.05)',
        },
    },
    tableContainer: {
        overflowX: 'auto',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        padding: '20px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        padding: '15px',
        textAlign: 'left',
        backgroundColor: '#2c3e50',
        color: '#fff',
        fontWeight: '600',
        fontSize: '16px',
        textTransform: 'uppercase',
    },
    td: {
        padding: '15px',
        textAlign: 'left',
        borderBottom: '1px solid #ecf0f1',
        fontSize: '15px',
        color: '#2c3e50',
    },
    tr: {
        transition: 'background-color 0.3s ease',
        ':hover': {
            backgroundColor: '#f5f7fa',
        },
    },
    chatButton: {
        backgroundColor: '#3498db',
        color: '#fff',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        ':hover': {
            backgroundColor: '#2980b9',
            transform: 'translateY(-2px)',
        },
    },
    chatContainer: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '400px',
        height: '500px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 6px 24px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid #ecf0f1',
    },
    chatHeader: {
        backgroundColor: '#2c3e50',
        color: '#fff',
        padding: '15px 20px',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chatTitle: {
        margin: 0,
        fontSize: '18px',
        fontWeight: '500',
    },
    closeButton: {
        backgroundColor: 'transparent',
        color: '#fff',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        padding: '0 10px',
        transition: 'color 0.3s ease',
        ':hover': {
            color: '#e74c3c',
        },
    },
    chatMessages: {
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        backgroundColor: '#f9fbfd',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    message: {
        maxWidth: '75%',
        padding: '12px 16px',
        borderRadius: '10px',
        fontSize: '14px',
        position: 'relative',
        transition: 'transform 0.2s ease',
    },
    senderName: {
        fontWeight: '600',
        fontSize: '12px',
        color: '#2c3e50',
        display: 'block',
        marginBottom: '4px',
    },
    messageText: {
        wordBreak: 'break-word',
    },
    timestamp: {
        fontSize: '10px',
        color: '#7f8c8d',
        display: 'block',
        marginTop: '6px',
        textAlign: 'right',
    },
    chatInput: {
        display: 'flex',
        padding: '15px',
        backgroundColor: '#fff',
        borderTop: '1px solid #ecf0f1',
    },
    input: {
        flex: 1,
        padding: '12px',
        border: '1px solid #dcdcdc',
        borderRadius: '6px',
        marginRight: '10px',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.3s ease',
        ':focus': {
            borderColor: '#2c3e50',
        },
    },
    sendButton: {
        backgroundColor: '#2ecc71',
        color: '#fff',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        ':hover': {
            backgroundColor: '#27ae60',
            transform: 'translateY(-2px)',
        },
    },
    notification: {
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: '#2ecc71',
        color: '#fff',
        padding: '12px 20px',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: 2000,
    },
};

// Add keyframes for loader animation
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);

export default UserAppointment;