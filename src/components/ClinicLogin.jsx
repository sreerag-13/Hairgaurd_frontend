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
                    const clinic = response.data.clinic;

                    if (!clinic) {
                        alert("Error: Clinic data not received.");
                        return;
                    }

                    // Store clinic details in sessionStorage
                    sessionStorage.setItem("token", response.data.token);
                    sessionStorage.setItem("_id", clinic._id);
                    sessionStorage.setItem("clinicName", clinic.clinicName);
                    sessionStorage.setItem("email", clinic.email);
                    sessionStorage.setItem("phone", clinic.phone);
                    sessionStorage.setItem("address", clinic.address);
                    sessionStorage.setItem("state", clinic.state);
                    sessionStorage.setItem("city", clinic.city);
                    sessionStorage.setItem("licenseNumber", clinic.licenseNumber);
                    sessionStorage.setItem("experienceYears", clinic.experienceYears);
                    sessionStorage.setItem("description", clinic.description || "No description available");

                    // Store only the image filename, NOT the full path
                    sessionStorage.setItem("image", clinic.image || "");

                    alert("Login Successful");
                    navigate('/ClinicDash'); // Navigate to the dashboard
                } else {
                    // Handle different error messages
                    alert(response.data.status === "incorrect password" 
                        ? "Incorrect Password" 
                        : response.data.status === "incorrect email" 
                        ? "Incorrect Email" 
                        : "Login failed");
                }
            })
            .catch((error) => {
                console.error("Login Error:", error);
                alert("An error occurred during login");
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
                    value={loginData.email}
                    onChange={inputHandler}
                    style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}
                />
                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={inputHandler}
                    style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}
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