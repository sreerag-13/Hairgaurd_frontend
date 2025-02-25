import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
    const [loginData, setLoginData] = useState({ Email: '', Password: '' });
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

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', width: '300px', textAlign: 'center' }}>
                <h2>User Login</h2>
                <label>Email:</label>
                <input type="text" name="Email" style={{ width: '100%', padding: '10px', margin: '10px 0' }} onChange={inputHandler} />
                <label>Password:</label>
                <input type="password" name="Password" style={{ width: '100%', padding: '10px', margin: '10px 0' }} onChange={inputHandler} />
                <button style={{ backgroundColor: '#28a745', color: '#ffffff', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={loginUser}>
                    Login
                </button>
            </div>
        </div>
    );
};

export default UserLogin;