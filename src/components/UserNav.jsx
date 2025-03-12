import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserNav = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear user session data (e.g., sessionStorage)
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userName');
        // Optionally clear other stored data
        sessionStorage.clear();

        // Redirect to UserLogin page
        navigate('/UserLogin');
    };

    return (
        <div style={{
            backgroundColor: '#2c3e50',
            padding: '15px 30px',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <h2 style={{
                margin: 0,
                fontSize: '1.8rem',
                fontWeight: '700',
                letterSpacing: '1px',
                cursor: 'pointer'
            }}
            onClick={() => navigate('/UserDash')}>
                HairGuard
            </h2>
            <ul style={{
                listStyle: 'none',
                padding: 0,
                display: 'flex',
                gap: '25px',
                alignItems: 'center'
            }}>
                <li
                    style={{
                        cursor: 'pointer',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        transition: 'background-color 0.3s ease, transform 0.2s',
                        fontSize: '1.1rem',
                        fontWeight: '500'
                    }}
                    onClick={() => navigate('/UserDash')}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = '#34495e'; e.target.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.transform = 'scale(1)'; }}
                >
                    Home
                </li>
                <li
                    style={{
                        cursor: 'pointer',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        transition: 'background-color 0.3s ease, transform 0.2s',
                        fontSize: '1.1rem',
                        fontWeight: '500'
                    }}
                    onClick={() => navigate('/UserAppointment')}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = '#34495e'; e.target.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.transform = 'scale(1)'; }}
                >
                    Your Appointments
                </li>
                <li
                    style={{
                        cursor: 'pointer',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        transition: 'background-color 0.3s ease, transform 0.2s',
                        fontSize: '1.1rem',
                        fontWeight: '500'
                    }}
                    onClick={() => navigate('/UserProfile')}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = '#34495e'; e.target.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.transform = 'scale(1)'; }}
                >
                    Profile
                </li>
                <li
                    style={{
                        cursor: 'pointer',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        transition: 'background-color 0.3s ease, transform 0.2s',
                        fontSize: '1.1rem',
                        fontWeight: '500'
                    }}
                    onClick={() => navigate('/UserCart')}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = '#34495e'; e.target.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.transform = 'scale(1)'; }}
                >
                    Booked Product
                </li>
                <li>
                    <button
                        style={{
                            background: '#ff4444',
                            color: '#fff',
                            padding: '12px 25px',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            transition: 'background 0.3s ease, transform 0.2s, box-shadow 0.3s ease',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                        }}
                        onClick={handleLogout}
                        onMouseEnter={(e) => { e.target.style.background = '#cc3333'; e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)'; }}
                        onMouseLeave={(e) => { e.target.style.background = '#ff4444'; e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)'; }}
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default UserNav;