import React from 'react';
import HomeNav from './HomeNav';

const Home = () => {
  return (
<div>
  <HomeNav/>
    <div
    
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: "url('/image (1).jpg') no-repeat center center fixed", // Use relative path
        backgroundSize: 'cover',
        position: 'relative',
        color: '#fff', // Set default text color
      }}
    >
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px' }}>
          HAIRGUARD
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '40px' }}>
          TREAT, BUY, PREDICT
        </p>
      </div>
      <footer
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Slight transparency for better readability
          color: '#fff',
          padding: '10px',
          textAlign: 'center',
        }}
      >
        <p>&copy; 2024 HAIRGUARD. All rights reserved.</p>
      </footer>
    </div>
    </div>
  );
};

export default Home;