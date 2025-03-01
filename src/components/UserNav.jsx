import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserNav = () => {
    const navigate = useNavigate();

    return (
        <div style={{ backgroundColor: '#2c3e50', padding: '10px 20px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>HairCare Pro</h2>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '20px' }}>
                <li 
                    style={{ cursor: 'pointer', padding: '10px', borderRadius: '4px', transition: 'background-color 0.3s' }}
                    onClick={() => navigate('/dashboard')}
                >
                    Home
                </li>
                <li 
                    style={{ cursor: 'pointer', padding: '10px', borderRadius: '4px', transition: 'background-color 0.3s' }}
                    onClick={() => navigate('/appointments')}
                >
                    Appointments
                </li>
                <li 
                    style={{ cursor: 'pointer', padding: '10px', borderRadius: '4px', transition: 'background-color 0.3s' }}
                    onClick={() => navigate('/profile')}
                >
                    Profile
                </li>
                <li 
                    style={{ cursor: 'pointer', padding: '10px', borderRadius: '4px', transition: 'background-color 0.3s' }}
                    onClick={() => navigate('/support')}
                >
                    Support
                </li>
            </ul>
        </div>
    );
};

export default UserNav;