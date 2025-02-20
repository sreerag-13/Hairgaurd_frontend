import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
    const [loginData, setLoginData] = useState({ Email: '', Password: '' });
    const navigate = useNavigate();

    const inputHandler = (event) => {
        setLoginData({ ...loginData, [event.target.name]: event.target.value });
    };

    const loginUser  = () => {
        axios.post("http://localhost:3031/signin", loginData)
            .then((response) => {
                if (response.data.status === "success") {
                    sessionStorage.setItem("token", response.data.token);
                    sessionStorage.setItem("userId", response.data.userid);
                    sessionStorage.setItem("userName", response.data.userName); // Save name

                    alert("Login Successful");
                    navigate('/dashboard'); // Redirect to Dashboard
                } else {
                    alert(response.data.status);
                }
            })
            .catch((error) => {
                console.error("Login Error:", error);
            });
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
        fontFamily: 'Arial, sans-serif',
    };

    const formStyle = {
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        width: '300px',
        textAlign: 'center',
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
    };

    const buttonStyle = {
        backgroundColor: '#28a745',
        color: '#ffffff',
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s',
    };

    const buttonHoverStyle = {
        backgroundColor: '#218838',
    };

    return (
        <div style={containerStyle}>
            <div style={formStyle}>
                <h2>User Login</h2>
                <label>Email:</label>
                <input
                    type="text"
                    name="Email"
                    style={inputStyle}
                    onChange={inputHandler}
                />
                <label>Password:</label>
                <input
                    type="password"
                    name="Password"
                    style={inputStyle}
                    onChange={inputHandler}
                />
                <button
                    style={buttonStyle}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
                    onClick={loginUser }
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default UserLogin;