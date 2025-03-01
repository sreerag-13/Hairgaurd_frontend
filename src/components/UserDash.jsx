import React from 'react';
import UserNav from './UserNav';
import { useNavigate } from 'react-router-dom';

const UserDash = () => {
    const navigate = useNavigate();
    const userName = sessionStorage.getItem("userName");
    const userEmail = sessionStorage.getItem("userEmail");
    const userGender = sessionStorage.getItem("userGender");
    const userPhone = sessionStorage.getItem("userPhone");
    const userAddress = sessionStorage.getItem("userAddress");
    const userState = sessionStorage.getItem("userState");
    const userCity = sessionStorage.getItem("userCity");

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7fa', minHeight: '100vh' }}>
            {/* Navbar */}
            <UserNav />

            {/* Main Content */}
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Welcome Section */}
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, color: '#2c3e50' }}>Welcome, {userName}!</h2>
                    <p><strong>Email:</strong> {userEmail}</p>
                    <p><strong>Gender:</strong> {userGender}</p>
                    <p><strong>Phone:</strong> {userPhone}</p>
                    <p><strong>Address:</strong> {userAddress}, {userCity}, {userState}</p>
                </div>

                {/* Main Functionalities Section */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                    {/* Buy Hair Products */}
                    <div 
                        style={{ 
                            backgroundColor: '#fff', 
                            padding: '20px', 
                            borderRadius: '8px', 
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', 
                            cursor: 'pointer', 
                            transition: 'transform 0.3s, box-shadow 0.3s' 
                        }}
                        onClick={() => navigate('/buy-products')}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <h3 style={{ margin: 0, color: '#1abc9c' }}>Buy Hair Products</h3>
                        <p style={{ color: '#555' }}>Explore and purchase the best hair care products.</p>
                    </div>

                    {/* Book Hair Clinic */}
                    <div 
                        style={{ 
                            backgroundColor: '#fff', 
                            padding: '20px', 
                            borderRadius: '8px', 
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', 
                            cursor: 'pointer', 
                            transition: 'transform 0.3s, box-shadow 0.3s' 
                        }}
                        onClick={() => navigate('/ViewAllClinic')}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <h3 style={{ margin: 0, color: '#3498db' }}>Book Hair Clinic</h3>
                        <p style={{ color: '#555' }}>Schedule an appointment with top hair clinics.</p>
                    </div>

                    {/* ML Hair Fall Prediction */}
                    <div 
                        style={{ 
                            backgroundColor: '#fff', 
                            padding: '20px', 
                            borderRadius: '8px', 
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', 
                            cursor: 'pointer', 
                            transition: 'transform 0.3s, box-shadow 0.3s' 
                        }}
                        onClick={() => navigate('/hairfall-prediction')}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <h3 style={{ margin: 0, color: '#e74c3c' }}>Hair Fall Prediction</h3>
                        <p style={{ color: '#555' }}>Predict the future of your hair health using AI.</p>
                    </div>
                </div>

                {/* Additional Features Section */}
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
                    <h3 style={{ margin: 0, color: '#2c3e50' }}>Additional Features</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ padding: '10px', margin: '5px 0', backgroundColor: '#f4f7fa', borderRadius: '4px' }}>View Appointment History</li>
                        <li style={{ padding: '10px', margin: '5px 0', backgroundColor: '#f4f7fa', borderRadius: '4px' }}>Manage Profile</li>
                        <li style={{ padding: '10px', margin: '5px 0', backgroundColor: '#f4f7fa', borderRadius: '4px' }}>Contact Support</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserDash;