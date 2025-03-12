import React from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorNav = () => {
  const navigate = useNavigate();
  const clinicId = sessionStorage.getItem('_id');

  const handleLogout = () => {
    sessionStorage.clear(); // Clear all sessionStorage data
    navigate('/ClinicLogin'); // Redirect to login page
  };

  const navItems = [
    { label: 'Home', path: '/ClinicDash', icon: '🏠' },
    { label: 'Doctors', path: '/DoctorAdd', icon: '👨‍⚕️' },
    { label: 'Appointments', path: '/Appointment', icon: '📅' },
    { label: 'Profile', path: `/DoctorProfile/${clinicId}`, icon: '👤' },
    { label: 'Logout', path: null, icon: '🚪', action: handleLogout }, // Logout item with custom action
  ];

  return (
    <nav
      style={{
        backgroundColor: '#1e2a44',
        width: '250px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        boxShadow: '4px 0 15px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 0',
        borderRight: '2px solid #2c3e50',
        transition: 'width 0.3s ease',
      }}
    >
      {/* Brand */}
      <div
        style={{
          padding: '20px',
          textAlign: 'center',
          borderBottom: '1px solid #2c3e50',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/ClinicDash')}
      >
        <h1
          style={{
            color: '#fff',
            fontSize: '1.6rem',
            fontWeight: '700',
            margin: 0,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            transition: 'color 0.3s ease, transform 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#3498db';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#fff';
            e.target.style.transform = 'scale(1)';
          }}
        >
          HairGuard
        </h1>
      </div>

      {/* Navigation Links */}
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          paddingTop: '20px',
        }}
      >
        {navItems.map((item, index) => (
          <li
            key={index}
            style={{
              position: 'relative',
              transition: 'background-color 0.3s ease, padding-left 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2c3e50';
              e.currentTarget.style.paddingLeft = '15px';
              const underline = e.currentTarget.querySelector('span:last-child');
              if (underline) underline.style.width = '50%';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.paddingLeft = '10px';
              const underline = e.currentTarget.querySelector('span:last-child');
              if (underline) underline.style.width = '0';
            }}
          >
            <div
              style={{
                color: '#fff',
                fontSize: '1.1rem',
                fontWeight: '500',
                textDecoration: 'none',
                padding: '15px 20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                transition: 'color 0.3s ease',
              }}
              onClick={() => (item.action ? item.action() : navigate(item.path))}
              onMouseEnter={(e) => (e.target.style.color = item.label === 'Logout' ? '#e74c3c' : '#3498db')}
              onMouseLeave={(e) => (e.target.style.color = '#fff')}
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              <span
                style={{
                  position: 'absolute',
                  bottom: '5px',
                  left: '50px',
                  width: '0',
                  height: '2px',
                  backgroundColor: item.label === 'Logout' ? '#e74c3c' : '#3498db',
                  transition: 'width 0.3s ease',
                }}
              ></span>
            </div>
          </li>
        ))}
      </ul>

      {/* Toggle Button for Collapsing */}
      <button
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          fontSize: '1.5rem',
          cursor: 'pointer',
          padding: '15px',
          textAlign: 'center',
          transition: 'color 0.3s ease, background-color 0.3s ease',
          borderTop: '1px solid #2c3e50',
        }}
        onClick={() => {
          const nav = document.querySelector('nav');
          const isCollapsed = nav.style.width === '80px';
          nav.style.width = isCollapsed ? '250px' : '80px';
          const labels = document.querySelectorAll('.nav-label');
          labels.forEach((label) =>
            label.style.display = isCollapsed ? 'inline' : 'none'
          );
        }}
        onMouseEnter={(e) => {
          e.target.style.color = '#3498db';
          e.target.style.backgroundColor = '#2c3e50';
        }}
        onMouseLeave={(e) => {
          e.target.style.color = '#fff';
          e.target.style.backgroundColor = 'transparent';
        }}
      >
        ↔
      </button>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          nav {
            width: 80px; /* Collapsed by default on mobile */
          }
          .nav-label {
            display: none; /* Hide labels on mobile by default */
          }
          h1 {
            font-size: 1.2rem !important;
            writing-mode: vertical-rl;
            transform: rotate(180deg);
            padding: 10px 0 !important;
          }
          ul {
            padding-top: 10px !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default DoctorNav;