import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
    const [loginData, setLoginData] = useState({ Email: '', Password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const inputHandler = (event) => {
        setLoginData({ ...loginData, [event.target.name]: event.target.value });
    };

    const loginUser = () => {
        axios.post("http://localhost:3031/signin", loginData)
            .then((response) => {
                if (response.data.status === "success") {
                    sessionStorage.setItem("token", response.data.token);
                    sessionStorage.setItem("userId", response.data.user._id);
                    sessionStorage.setItem("userName", response.data.user.UName);
                    sessionStorage.setItem("userEmail", response.data.user.Email);
                    sessionStorage.setItem("userGender", response.data.user.Gender);
                    sessionStorage.setItem("userPhone", response.data.user.Phone);
                    sessionStorage.setItem("userAddress", response.data.user.uaddress);
                    sessionStorage.setItem("userState", response.data.user.state);
                    sessionStorage.setItem("userCity", response.data.user.City);

                    alert("Login Successful");
                    navigate('/UserDash');
                } else {
                    alert(response.data.status);
                }
            })
            .catch((error) => {
                console.error("Login Error:", error);
            });
    };

    const goToHome = () => {
        navigate('/');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: '#ffffff',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                width: '350px',
                textAlign: 'center',
                border: '1px solid #2c3e50'
            }}>
                <h2 style={{
                    color: '#2c3e50',
                    marginBottom: '25px',
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 'bold'
                }}>
                    User Login
                </h2>
                
                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        color: '#2c3e50',
                        marginBottom: '8px',
                        fontSize: '16px',
                        fontWeight: '500'
                    }}>
                        Email:
                    </label>
                    <input
                        type="text"
                        name="Email"
                        onChange={inputHandler}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #2c3e50',
                            fontSize: '16px',
                            outline: 'none',
                            transition: 'border-color 0.3s',
                            backgroundColor: '#f8f9fa',
                            boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3498db'}
                        onBlur={(e) => e.target.style.borderColor = '#2c3e50'}
                    />
                </div>

                <div style={{ marginBottom: '25px', position: 'relative' }}>
                    <label style={{
                        display: 'block',
                        color: '#2c3e50',
                        marginBottom: '8px',
                        fontSize: '16px',
                        fontWeight: '500'
                    }}>
                        Password:
                    </label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="Password"
                        onChange={inputHandler}
                        style={{
                            width: '100%',
                            padding: '12px',
                            paddingRight: '40px',
                            borderRadius: '6px',
                            border: '1px solid #2c3e50',
                            fontSize: '16px',
                            outline: 'none',
                            transition: 'border-color 0.3s',
                            backgroundColor: '#f8f9fa',
                            boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3498db'}
                        onBlur={(e) => e.target.style.borderColor = '#2c3e50'}
                    />
                    <span
                        onClick={togglePasswordVisibility}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(10%)',
                            cursor: 'pointer',
                            color: '#2c3e50',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </span>
                </div>

                <button
                    onClick={loginUser}
                    style={{
                        backgroundColor: '#2c3e50',
                        color: '#ffffff',
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s, transform 0.1s',
                        width: '100%',
                        marginBottom: '15px'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#3498db'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#2c3e50'}
                    onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                >
                    Login
                </button>

                <button
                    onClick={goToHome}
                    style={{
                        backgroundColor: '#ffffff',
                        color: '#2c3e50',
                        padding: '10px 20px',
                        border: '2px solid #2c3e50',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s, color 0.3s',
                        width: '100%'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#2c3e50';
                        e.target.style.color = '#ffffff';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#ffffff';
                        e.target.style.color = '#2c3e50';
                    }}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default UserLogin;