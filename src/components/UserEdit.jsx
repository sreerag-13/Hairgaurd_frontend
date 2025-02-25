import React from 'react'


const UserDash = () => {
    const userName = sessionStorage.getItem("userName");
    const userEmail = sessionStorage.getItem("userEmail");
    const userGender = sessionStorage.getItem("userGender");
    const userPhone = sessionStorage.getItem("userPhone");
    const userAddress = sessionStorage.getItem("userAddress");
    const userState = sessionStorage.getItem("userState");
    const userCity = sessionStorage.getItem("userCity");

    return (
        <div>
            
        <div style={{ padding: '20px' }}>
            <h2>Welcome, {userName}!</h2>
            <p><strong>Email:</strong> {userEmail}</p>
            <p><strong>Gender:</strong> {userGender}</p>
            <p><strong>Phone:</strong> {userPhone}</p>
            <p><strong>Address:</strong> {userAddress}, {userCity}, {userState}</p>
        </div>
        </div>
    );
};

export default UserEdit