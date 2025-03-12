import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ClinicLogin = () => {
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const navigate = useNavigate();

    const inputHandler = (event) => {
        setLoginData({ ...loginData, [event.target.name]: event.target.value });
    };

    const loginClinic = () => {
        axios
            .post('http://localhost:3031/clinic-signin', loginData)
            .then((response) => {
                if (response.data.status === 'success') {
                    const clinic = response.data.clinic;

                    if (!clinic) {
                        alert('Error: Clinic data not received.');
                        return;
                    }

                    // Store clinic details in sessionStorage
                    sessionStorage.setItem('token', response.data.token);
                    sessionStorage.setItem('_id', clinic._id);
                    sessionStorage.setItem('clinicName', clinic.clinicName);
                    sessionStorage.setItem('email', clinic.email);
                    sessionStorage.setItem('phone', clinic.phone);
                    sessionStorage.setItem('address', clinic.address);
                    sessionStorage.setItem('state', clinic.state);
                    sessionStorage.setItem('city', clinic.city);
                    sessionStorage.setItem('licenseNumber', clinic.licenseNumber);
                    sessionStorage.setItem('experienceYears', clinic.experienceYears);
                    sessionStorage.setItem('description', clinic.description || 'No description available');
                    sessionStorage.setItem('image', clinic.image || '');

                    alert('Login Successful');
                    navigate('/ClinicDash');
                } else {
                    alert(
                        response.data.status === 'incorrect password'
                            ? 'Incorrect Password'
                            : response.data.status === 'incorrect email'
                            ? 'Incorrect Email'
                            : 'Login failed'
                    );
                }
            })
            .catch((error) => {
                console.error('Login Error:', error);
                alert('An error occurred during login');
            });
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #eef2f3 0%, #e6e9f0 100%)',
                fontFamily: "'Roboto', sans-serif",
            }}
        >
            <div
                style={{
                    backgroundColor: '#ffffff',
                    padding: '40px',
                    borderRadius: '20px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                    width: '400px',
                    textAlign: 'center',
                    border: '1px solid #e0e6ed',
                }}
            >
                <h2
                    style={{
                        color: '#1e2a44',
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        marginBottom: '30px',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                    }}
                >
                    Clinic Login
                </h2>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                    }}
                >
                    <div>
                        <label
                            style={{
                                color: '#2c3e50',
                                fontWeight: '600',
                                marginBottom: '8px',
                                display: 'block',
                            }}
                        >
                            Email
                        </label>
                        <input
                            type="text"
                            name="email"
                            value={loginData.email}
                            onChange={inputHandler}
                            style={{
                                width: '100%',
                                padding: '12px 15px',
                                borderRadius: '10px',
                                border: '1px solid #d1d9e6',
                                fontSize: '1rem',
                                color: '#34495e',
                                backgroundColor: '#f9fafc',
                                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#3498db';
                                e.target.style.boxShadow = '0 0 5px rgba(52, 152, 219, 0.3)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#d1d9e6';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                    <div
                        style={{
                            position: 'relative',
                        }}
                    >
                        <label
                            style={{
                                color: '#2c3e50',
                                fontWeight: '600',
                                marginBottom: '8px',
                                display: 'block',
                            }}
                        >
                            Password
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={loginData.password}
                            onChange={inputHandler}
                            style={{
                                width: '100%',
                                padding: '12px 40px 12px 15px', // Extra padding for eye icon
                                borderRadius: '10px',
                                border: '1px solid #d1d9e6',
                                fontSize: '1rem',
                                color: '#34495e',
                                backgroundColor: '#f9fafc',
                                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#3498db';
                                e.target.style.boxShadow = '0 0 5px rgba(52, 152, 219, 0.3)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#d1d9e6';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                        <span
                            style={{
                                position: 'absolute',
                                right: '15px',
                                top: '50%',
                                transform: 'translateY(10%)',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                color: '#3498db',
                                transition: 'color 0.3s ease',
                            }}
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseEnter={(e) => (e.target.style.color = '#1e2a44')}
                            onMouseLeave={(e) => (e.target.style.color = '#3498db')}
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </span>
                    </div>
                    <button
                        style={{
                            padding: '12px 40px',
                            background: '#1e2a44',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background 0.3s ease, transform 0.3s ease',
                            boxShadow: '0 4px 15px rgba(30, 42, 68, 0.2)',
                        }}
                        onClick={loginClinic}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#3498db';
                            e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = '#1e2a44';
                            e.target.style.transform = 'scale(1)';
                        }}
                    >
                        Login
                    </button>
                    <button
                        style={{
                            padding: '12px 40px',
                            background: '#f9fafc',
                            color: '#1e2a44',
                            border: '1px solid #d1d9e6',
                            borderRadius: '10px',
                            fontSize: '1rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'background 0.3s ease, color 0.3s ease, transform 0.3s ease',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                        }}
                        onClick={() => navigate('/')}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#3498db';
                            e.target.style.color = '#fff';
                            e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = '#f9fafc';
                            e.target.style.color = '#1e2a44';
                            e.target.style.transform = 'scale(1)';
                        }}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClinicLogin;