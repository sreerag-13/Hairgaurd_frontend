import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Navbar Component
const UserNav = () => {
    const navigate = useNavigate();

    return (
        <div style={{ 
            backgroundColor: '#2c3e50', 
            padding: '15px 30px', 
            color: '#fff', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <h2 style={{ 
                margin: 0, 
                fontFamily: 'Arial, sans-serif', 
                fontSize: '1.8rem', 
                fontWeight: '700',
                letterSpacing: '1px' 
            }}>
                HairGuard
            </h2>
            <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                display: 'flex', 
                gap: '25px', 
                margin: 0 
            }}>
                <li 
                    style={{ 
                        cursor: 'pointer', 
                        padding: '10px 15px', 
                        borderRadius: '6px', 
                        transition: 'background-color 0.3s, transform 0.2s', 
                        fontSize: '1rem',
                        fontWeight: '500'
                    }}
                    onClick={() => navigate('/UserDash')}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#34495e'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    Home
                </li>
                <li 
                    style={{ 
                        cursor: 'pointer', 
                        padding: '10px 15px', 
                        borderRadius: '6px', 
                        transition: 'background-color 0.3s, transform 0.2s', 
                        fontSize: '1rem',
                        fontWeight: '500'
                    }}
                    onClick={() => navigate('/UserAppointment')}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#34495e'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    Your Appointments
                </li>
                <li 
                    style={{ 
                        cursor: 'pointer', 
                        padding: '10px 15px', 
                        borderRadius: '6px', 
                        transition: 'background-color 0.3s, transform 0.2s', 
                        fontSize: '1rem',
                        fontWeight: '500'
                    }}
                    onClick={() => navigate('/UserProfile')}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#34495e'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    Profile
                </li>
                <li 
                    style={{ 
                        cursor: 'pointer', 
                        padding: '10px 15px', 
                        borderRadius: '6px', 
                        transition: 'background-color 0.3s, transform 0.2s', 
                        fontSize: '1rem',
                        fontWeight: '500'
                    }}
                    onClick={() => navigate('/UserCart')}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#34495e'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    Booked Product
                </li>
            </ul>
        </div>
    );
};

// Predict Component
const Predict = () => {
  const [formData, setFormData] = useState({
    'date ': '17-10-2021',
    stay_up_late: 2,
    pressure_level: 'Low',
    coffee_consumed: 0,
    brain_working_duration: 1,
    school_assesssment: 'None',
    stress_level: 'Low',
    shampoo_brand: 'Pantene',
    swimming: 'No',
    hair_washing: 'N',
    hair_grease: 3,
    dandruff: 'None',
    libido: 3
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isManualOpen, setIsManualOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError(null);

    console.log('Form submitted with data:', formData);

    const requestOptions = {
      method: 'POST',
      url: 'http://localhost:5000/predict',
      data: formData,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 5000
    };

    try {
      const response = await axios(requestOptions);
      console.log('Response from server:', response.data);
      setResult(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'An error occurred';
      console.error('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        config: err.config
      });
      setError(errorMessage);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #ecf0f1 0%, #dfe4ea 100%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Navbar */}
      <UserNav />

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px'
      }}>
        <div style={{
          maxWidth: '650px',
          width: '100%',
          background: '#fff',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
          border: '2px solid #2c3e50'
        }}>
          <h1 style={{
            textAlign: 'center',
            marginBottom: '35px',
            color: '#2c3e50',
            fontFamily: 'Arial, sans-serif',
            fontWeight: '700',
            fontSize: '2.5rem',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Hair Loss Prediction
          </h1>

          {/* User Manual Section */}
          <div style={{ marginBottom: '30px' }}>
            <button
              onClick={() => setIsManualOpen(!isManualOpen)}
              style={{
                padding: '12px 20px',
                background: '#2c3e50',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'center',
                transition: 'background 0.3s ease, transform 0.2s',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => e.target.style.background = '#34495e'}
              onMouseLeave={(e) => e.target.style.background = '#2c3e50'}
            >
              {isManualOpen ? 'Hide User Manual' : 'Show User Manual'}
            </button>

            {isManualOpen && (
              <div style={{
                marginTop: '25px',
                padding: '25px',
                background: '#f1f5f8',
                borderRadius: '15px',
                color: '#2c3e50',
                fontSize: '1rem',
                lineHeight: '1.6',
                border: '1px solid #34495e',
                boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.05)'
              }}>
                <h2 style={{ fontSize: '1.6rem', marginBottom: '20px', fontWeight: '600' }}>User Manual: Hair Loss Prediction Tool</h2>
                <p style={{ marginBottom: '15px' }}>Welcome to the Hair Loss Prediction Tool! This tool predicts your likelihood of hair loss based on daily habits and conditions. Fill out the form with your details for a specific day, then click "Predict" to see the results.</p>

                <h3 style={{ fontSize: '1.3rem', margin: '20px 0 15px', fontWeight: '600' }}>Field Guide</h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '25px', marginBottom: '20px' }}>
                  <li><strong>Date:</strong> Enter the day (e.g., <code>12-03-2025</code>). Tracks changes over time.</li>
                  <li><strong>Stay Up Late:</strong> Hours past bedtime (0-8+). Lack of sleep may stress hair.</li>
                  <li><strong>Pressure Level:</strong> Low to Very High. High pressure can increase hair loss.</li>
                  <li><strong>Coffee Consumed:</strong> Cups (0-10+). Too much caffeine might affect hair health.</li>
                  <li><strong>Brain Working Duration:</strong> Mental work hours (0-18+). Overworking may cause hair loss.</li>
                  <li><strong>School Assessment:</strong> None to Very High. Academic stress impacts hair.</li>
                  <li><strong>Stress Level:</strong> Low to Very High. Chronic stress is a key factor.</li>
                  <li><strong>Shampoo Brand:</strong> E.g., Pantene. Ingredients may affect scalp health.</li>
                  <li><strong>Swimming:</strong> Yes/No. Chlorine can dry hair, increasing breakage.</li>
                  <li><strong>Hair Washing:</strong> Y/N. Affects scalp oiliness.</li>
                  <li><strong>Hair Grease:</strong> 1-5 (1 = clean, 5 = greasy). Excess oil may clog follicles.</li>
                  <li><strong>Dandruff:</strong> None/Few/Many. Severe dandruff can irritate the scalp.</li>
                  <li><strong>Libido:</strong> 0-5 (0 = none, 5 = high). Reflects hormonal health tied to hair.</li>
                </ul>

                <h3 style={{ fontSize: '1.3rem', margin: '20px 0 15px', fontWeight: '600' }}>How It Works</h3>
                <p style={{ marginBottom: '15px' }}>The tool uses a model trained on daily logs to spot patterns (e.g., high stress = more hair loss). Enter data for one day to get a prediction.</p>

                <h3 style={{ fontSize: '1.3rem', margin: '20px 0 15px', fontWeight: '600' }}>Tips</h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '25px' }}>
                  <li>Be consistent with daily data.</li>
                  <li>Use realistic values.</li>
                  <li>Designed for daily use.</li>
                </ul>
              </div>
            )}
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ color: '#2c3e50', fontWeight: '600', fontSize: '1.1rem' }}>Date:</label>
              <input
                type="text"
                name="date "
                value={formData['date ']}
                onChange={handleChange}
                required
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #34495e',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  background: '#f9fbfc',
                  color: '#2c3e50'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#3498db'; e.target.style.boxShadow = '0 0 8px rgba(52, 152, 219, 0.3)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#34495e'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ color: '#2c3e50', fontWeight: '600', fontSize: '1.1rem' }}>Stay Up Late (hours):</label>
              <input
                type="number"
                name="stay_up_late"
                value={formData.stay_up_late}
                onChange={handleChange}
                required
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #34495e',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  background: '#f9fbfc',
                  color: '#2c3e50'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#3498db'; e.target.style.boxShadow = '0 0 8px rgba(52, 152, 219, 0.3)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#34495e'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ color: '#2c3e50', fontWeight: '600', fontSize: '1.1rem' }}>Pressure Level:</label>
              <select
                name="pressure_level"
                value={formData.pressure_level}
                onChange={handleChange}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #34495e',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  background: '#f9fbfc',
                  color: '#2c3e50',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%232c3e50\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 14px center',
                  backgroundSize: '16px'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#3498db'; e.target.style.boxShadow = '0 0 8px rgba(52, 152, 219, 0.3)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#34495e'; e.target.style.boxShadow = 'none'; }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Very High">Very High</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ color: '#2c3e50', fontWeight: '600', fontSize: '1.1rem' }}>Coffee Consumed (cups):</label>
              <input
                type="number"
                name="coffee_consumed"
                value={formData.coffee_consumed}
                onChange={handleChange}
                required
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #34495e',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  background: '#f9fbfc',
                  color: '#2c3e50'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#3498db'; e.target.style.boxShadow = '0 0 8px rgba(52, 152, 219, 0.3)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#34495e'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ color: '#2c3e50', fontWeight: '600', fontSize: '1.1rem' }}>Brain Working Duration (hours):</label>
              <input
                type="number"
                name="brain_working_duration"
                value={formData.brain_working_duration}
                onChange={handleChange}
                required
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #34495e',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  background: '#f9fbfc',
                  color: '#2c3e50'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#3498db'; e.target.style.boxShadow = '0 0 8px rgba(52, 152, 219, 0.3)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#34495e'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ color: '#2c3e50', fontWeight: '600', fontSize: '1.1rem' }}>School Assessment:</label>
              <select
                name="school_assesssment"
                value={formData.school_assesssment}
                onChange={handleChange}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #34495e',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  background: '#f9fbfc',
                  color: '#2c3e50',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%232c3e50\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 14px center',
                  backgroundSize: '16px'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#3498db'; e.target.style.boxShadow = '0 0 8px rgba(52, 152, 219, 0.3)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#34495e'; e.target.style.boxShadow = 'none'; }}
              >
                <option value="None">None</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Very High">Very High</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ color: '#2c3e50', fontWeight: '600', fontSize: '1.1rem' }}>Stress Level:</label>
              <select
                name="stress_level"
                value={formData.stress_level}
                onChange={handleChange}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #34495e',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  background: '#f9fbfc',
                  color: '#2c3e50',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%232c3e50\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 14px center',
                  backgroundSize: '16px'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#3498db'; e.target.style.boxShadow = '0 0 8px rgba(52, 152, 219, 0.3)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#34495e'; e.target.style.boxShadow = 'none'; }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Very High">Very High</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ color: '#2c3e50', fontWeight: '600', fontSize: '1.1rem' }}>Shampoo Brand:</label>
              <input
                type="text"
                name="shampoo_brand"
                value={formData.shampoo_brand}
                onChange={handleChange}
                required
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #34495e',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  background: '#f9fbfc',
                  color: '#2c3e50'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#3498db'; e.target.style.boxShadow = '0 0 8px rgba(52, 152, 219, 0.3)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#34495e'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ color: '#2c3e50', fontWeight: '600', fontSize: '1.1rem' }}>Swimming:</label>
              <select
                name="swimming"
                value={formData.swimming}
                onChange={handleChange}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #34495e',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  background: '#f9fbfc',
                  color: '#2c3e50',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%232c3e50\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 14px center',
                  backgroundSize: '16px'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#3498db'; e.target.style.boxShadow = '0 0 8px rgba(52, 152, 219, 0.3)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#34495e'; e.target.style.boxShadow = 'none'; }}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ color: '#2c3e50', fontWeight: '600', fontSize: '1.1rem' }}>Hair Washing:</label>
              <select
                name="hair_washing"
                value={formData.hair_washing}
                onChange={handleChange}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #34495e',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  background: '#f9fbfc',
                  color: '#2c3e50',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%232c3e50\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 14px center',
                  backgroundSize: '16px'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#3498db'; e.target.style.boxShadow = '0 0 8px rgba(52, 152, 219, 0.3)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#34495e'; e.target.style.boxShadow = 'none'; }}
              >
                <option value="N">No</option>
                <option value="Y">Yes</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ color: '#2c3e50', fontWeight: '600', fontSize: '1.1rem' }}>Hair Grease (1-5):</label>
              <input
                type="number"
                name="hair_grease"
                value={formData.hair_grease}
                onChange={handleChange}
                required
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #34495e',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  background: '#f9fbfc',
                  color: '#2c3e50'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#3498db'; e.target.style.boxShadow = '0 0 8px rgba(52, 152, 219, 0.3)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#34495e'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ color: '#2c3e50', fontWeight: '600', fontSize: '1.1rem' }}>Dandruff:</label>
              <select
                name="dandruff"
                value={formData.dandruff}
                onChange={handleChange}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #34495e',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  background: '#f9fbfc',
                  color: '#2c3e50',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%232c3e50\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 14px center',
                  backgroundSize: '16px'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#3498db'; e.target.style.boxShadow = '0 0 8px rgba(52, 152, 219, 0.3)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#34495e'; e.target.style.boxShadow = 'none'; }}
              >
                <option value="None">None</option>
                <option value="Few">Few</option>
                <option value="Many">Many</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ color: '#2c3e50', fontWeight: '600', fontSize: '1.1rem' }}>Libido (0-5):</label>
              <input
                type="number"
                name="libido"
                value={formData.libido}
                onChange={handleChange}
                required
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #34495e',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  background: '#f9fbfc',
                  color: '#2c3e50'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#3498db'; e.target.style.boxShadow = '0 0 8px rgba(52, 152, 219, 0.3)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#34495e'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '16px',
                background: '#2c3e50',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.2rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.3s ease, transform 0.2s, box-shadow 0.3s ease',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => { e.target.style.background = '#34495e'; e.target.style.transform = 'scale(1.02)'; e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)'; }}
              onMouseLeave={(e) => { e.target.style.background = '#2c3e50'; e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'; }}
            >
              Predict
            </button>
          </form>

          {result && (
            <div style={{
              marginTop: '35px',
              padding: '25px',
              background: '#e8f4f8',
              borderRadius: '15px',
              textAlign: 'center',
              border: '1px solid #2c3e50',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{ color: '#2c3e50', marginBottom: '15px', fontSize: '1.6rem', fontWeight: '600' }}>Result</h2>
              <p style={{ color: '#34495e', fontSize: '1.2rem', margin: '10px 0' }}>
                Prediction: <strong>{result.prediction === 0 ? 'No/Minimal Hair Loss' : 'Significant Hair Loss'}</strong>
              </p>
              <p style={{ color: '#34495e', fontSize: '1.2rem', margin: '10px 0' }}>
                Probability: <strong>{(result.probability * 100).toFixed(2)}%</strong>
              </p>
            </div>
          )}

          {error && (
            <div style={{
              marginTop: '35px',
              padding: '25px',
              background: '#fce4e4',
              borderRadius: '15px',
              textAlign: 'center',
              border: '1px solid #c0392b',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{ color: '#c0392b', marginBottom: '15px', fontSize: '1.6rem', fontWeight: '600' }}>Error</h2>
              <p style={{ color: '#c0392b', fontSize: '1.2rem' }}>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predict;