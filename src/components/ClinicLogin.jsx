import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ClinicLogin = () => {
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const inputHandler = (event) => {
        setLoginData({ ...loginData, [event.target.name]: event.target.value });
    };

    const loginClinic = () => {
        axios.post("http://localhost:3031/clinic-signin", loginData)
            .then((response) => {
                if (response.data.status === "success") {
                    sessionStorage.setItem("token", response.data.token);
                    sessionStorage.setItem("clinicId", response.data.clinicId);
                    sessionStorage.setItem("clinicName", response.data.clinicName);

                    alert("Login Successful");
                    navigate('/clinic-dashboard');
                } else {
                    alert(response.data.status);
                }
            })
            .catch((error) => {
                console.error("Login Error:", error);
            });
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', width: '300px', textAlign: 'center' }}>
                <h2>Clinic Login</h2>
                <label>Email:</label>
                <input
                    type="text"
                    name="email"
                    style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}
                    onChange={inputHandler}
                />
                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}
                    onChange={inputHandler}
                />
                <button
                    style={{ backgroundColor: '#28a745', color: '#ffffff', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', transition: 'background-color 0.3s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
                    onClick={loginClinic}
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default ClinicLogin;
