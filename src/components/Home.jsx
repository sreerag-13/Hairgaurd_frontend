import React from 'react';
import HomeNav from './HomeNav';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", overflow: 'hidden' }}>
      <HomeNav />
      <div
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: "url('https://tse4.mm.bing.net/th?id=OIP.qYwuUrbN7juM4QnxIwlKpQHaCh&pid=Api&P=0&h=180') no-repeat center center/cover",
          position: 'relative',
          color: '#fff',
        }}
      >
        {/* Dark overlay for better text contrast */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 0,
          }}
        />

        {/* Main content */}
        <div
          style={{
            textAlign: 'center',
            zIndex: 1,
            maxWidth: '800px',
            padding: '0 20px',
          }}
        >
          <h1
            style={{
              fontSize: '4.5rem',
              fontWeight: '700',
              marginBottom: '20px',
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)',
              lineHeight: '1.2',
            }}
          >
            HAIRGUARD
          </h1>
          <p
            style={{
              fontSize: '1.75rem',
              fontWeight: '400',
              marginBottom: '40px',
              textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)',
              lineHeight: '1.6',
            }}
          >
            Treat, Buy, and Predict Your Hair Health with Confidence
          </p>

          {/* Call-to-action buttons */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/predict"
              style={{
                padding: '15px 40px',
                backgroundColor: '#28A745',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '30px',
                fontSize: '1.1rem',
                fontWeight: '600',
                transition: 'background-color 0.3s ease, transform 0.3s ease',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#218838';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#28A745';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Predict Now
            </Link>
            <Link
              to="/shop"
              style={{
                padding: '15px 40px',
                backgroundColor: 'transparent',
                border: '2px solid #fff',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '30px',
                fontSize: '1.1rem',
                fontWeight: '600',
                transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.3s ease',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#fff';
                e.target.style.color = '#333';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#fff';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Shop Treatments
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            padding: '15px',
            textAlign: 'center',
            fontSize: '0.9rem',
            zIndex: 1,
          }}
        >
          <p>© 2024 HAIRGUARD. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;