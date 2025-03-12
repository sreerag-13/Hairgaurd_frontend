import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DoctorNav from './DoctorNav';

const DoctorProfile = () => {
    const navigate = useNavigate();
    const clinicId = sessionStorage.getItem('_id');
    const [clinicData, setClinicData] = useState({
        clinicName: '',
        email: '',
        phone: '',
        address: '',
        state: '',
        city: '',
        licenseNumber: '',
        experienceYears: '',
        description: '',
        image: ''
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClinicData = async () => {
            if (!clinicId) {
                setError('No clinic ID found. Please log in again.');
                return;
            }
            try {
                const response = await axios.get(`http://localhost:3031/clinic/${clinicId}`);
                if (response.data.status === 'success') {
                    setClinicData(response.data.data);
                } else {
                    setError('Failed to fetch clinic data');
                }
            } catch (err) {
                setError('An error occurred while fetching clinic data');
            }
        };
        fetchClinicData();
    }, [clinicId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClinicData({ ...clinicData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        Object.keys(clinicData).forEach(key => {
            if (key !== 'image') formData.append(key, clinicData[key]);
        });
        if (file) formData.append('image', file);

        try {
            const response = await axios.put(`http://localhost:3031/clinic/${clinicId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.status === 'success') {
                Object.keys(clinicData).forEach(key => sessionStorage.setItem(key, clinicData[key]));
                if (response.data.data.image) {
                    sessionStorage.setItem('image', response.data.data.image.split('/uploads/')[1]);
                }
                alert('Clinic profile updated successfully!');
                navigate('/ClinicDash');
            } else {
                setError('Failed to update clinic profile');
            }
        } catch (err) {
            setError('An error occurred while updating clinic profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #eef2f3 0%, #e6e9f0 100%)',
                fontFamily: "'Roboto', sans-serif",
            }}
        >
            <DoctorNav />
            <div
                style={{
                    marginLeft: '250px',
                    flex: 1,
                    padding: '40px 20px',
                    overflowY: 'auto',
                    width: 'calc(100vw - 250px)',
                }}
            >
                <div
                    style={{
                        maxWidth: '700px',
                        width: '100%',
                        background: '#ffffff',
                        borderRadius: '20px',
                        padding: '40px',
                        margin: '0 auto',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                        border: '1px solid #e0e6ed',
                    }}
                >
                    <h2
                        style={{
                            textAlign: 'center',
                            color: '#1e2a44',
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            marginBottom: '40px',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                        }}
                    >
                        Clinic Profile
                    </h2>

                    {clinicData.image && (
                        <div
                            style={{
                                textAlign: 'center',
                                marginBottom: '40px',
                            }}
                        >
                            <img
                                src={`http://localhost:3031${clinicData.image}`}
                                alt="Clinic"
                                style={{
                                    width: '180px',
                                    height: '180px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '5px solid #3498db',
                                    boxShadow: '0 4px 15px rgba(52, 152, 219, 0.2)',
                                    transition: 'transform 0.3s ease',
                                }}
                                onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                                onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                            />
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '20px',
                        }}
                    >
                        <div>
                            <label
                                style={{
                                    color: '#2c3e50',
                                    fontWeight: '600',
                                    marginBottom: '8px',
                                    display: 'block',
                                }}
                            >
                                Clinic Name
                            </label>
                            <input
                                type="text"
                                name="clinicName"
                                value={clinicData.clinicName}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    borderRadius: '10px',
                                    border: '1px solid #d1d9e6',
                                    fontSize: '1rem',
                                    color: '#34495e',
                                    backgroundColor: '#f9fafc',
                                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#3498db';
                                    e.target.style.boxShadow = '0 0 5px rgba(52, 152, 219, 0.3)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d9e6';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        <div>
                            <label
                                style={{
                                    color: '#2c3e50',
                                    fontWeight: '600',
                                    marginBottom: '8px',
                                    display: 'block',
                                }}
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={clinicData.email}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    borderRadius: '10px',
                                    border: '1px solid #d1d9e6',
                                    fontSize: '1rem',
                                    color: '#34495e',
                                    backgroundColor: '#f9fafc',
                                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#3498db';
                                    e.target.style.boxShadow = '0 0 5px rgba(52, 152, 219, 0.3)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d9e6';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        <div>
                            <label
                                style={{
                                    color: '#2c3e50',
                                    fontWeight: '600',
                                    marginBottom: '8px',
                                    display: 'block',
                                }}
                            >
                                Phone
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={clinicData.phone}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    borderRadius: '10px',
                                    border: '1px solid #d1d9e6',
                                    fontSize: '1rem',
                                    color: '#34495e',
                                    backgroundColor: '#f9fafc',
                                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#3498db';
                                    e.target.style.boxShadow = '0 0 5px rgba(52, 152, 219, 0.3)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d9e6';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        <div>
                            <label
                                style={{
                                    color: '#2c3e50',
                                    fontWeight: '600',
                                    marginBottom: '8px',
                                    display: 'block',
                                }}
                            >
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={clinicData.address}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    borderRadius: '10px',
                                    border: '1px solid #d1d9e6',
                                    fontSize: '1rem',
                                    color: '#34495e',
                                    backgroundColor: '#f9fafc',
                                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#3498db';
                                    e.target.style.boxShadow = '0 0 5px rgba(52, 152, 219, 0.3)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d9e6';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        <div>
                            <label
                                style={{
                                    color: '#2c3e50',
                                    fontWeight: '600',
                                    marginBottom: '8px',
                                    display: 'block',
                                }}
                            >
                                State
                            </label>
                            <input
                                type="text"
                                name="state"
                                value={clinicData.state}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    borderRadius: '10px',
                                    border: '1px solid #d1d9e6',
                                    fontSize: '1rem',
                                    color: '#34495e',
                                    backgroundColor: '#f9fafc',
                                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#3498db';
                                    e.target.style.boxShadow = '0 0 5px rgba(52, 152, 219, 0.3)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d9e6';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        <div>
                            <label
                                style={{
                                    color: '#2c3e50',
                                    fontWeight: '600',
                                    marginBottom: '8px',
                                    display: 'block',
                                }}
                            >
                                City
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={clinicData.city}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    borderRadius: '10px',
                                    border: '1px solid #d1d9e6',
                                    fontSize: '1rem',
                                    color: '#34495e',
                                    backgroundColor: '#f9fafc',
                                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#3498db';
                                    e.target.style.boxShadow = '0 0 5px rgba(52, 152, 219, 0.3)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d9e6';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        <div>
                            <label
                                style={{
                                    color: '#2c3e50',
                                    fontWeight: '600',
                                    marginBottom: '8px',
                                    display: 'block',
                                }}
                            >
                                License Number
                            </label>
                            <input
                                type="text"
                                name="licenseNumber"
                                value={clinicData.licenseNumber}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    borderRadius: '10px',
                                    border: '1px solid #d1d9e6',
                                    fontSize: '1rem',
                                    color: '#34495e',
                                    backgroundColor: '#f9fafc',
                                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#3498db';
                                    e.target.style.boxShadow = '0 0 5px rgba(52, 152, 219, 0.3)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d9e6';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        <div>
                            <label
                                style={{
                                    color: '#2c3e50',
                                    fontWeight: '600',
                                    marginBottom: '8px',
                                    display: 'block',
                                }}
                            >
                                Experience (Years)
                            </label>
                            <input
                                type="number"
                                name="experienceYears"
                                value={clinicData.experienceYears}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    borderRadius: '10px',
                                    border: '1px solid #d1d9e6',
                                    fontSize: '1rem',
                                    color: '#34495e',
                                    backgroundColor: '#f9fafc',
                                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#3498db';
                                    e.target.style.boxShadow = '0 0 5px rgba(52, 152, 219, 0.3)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d9e6';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        <div
                            style={{
                                gridColumn: 'span 2',
                            }}
                        >
                            <label
                                style={{
                                    color: '#2c3e50',
                                    fontWeight: '600',
                                    marginBottom: '8px',
                                    display: 'block',
                                }}
                            >
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={clinicData.description}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    borderRadius: '10px',
                                    border: '1px solid #d1d9e6',
                                    fontSize: '1rem',
                                    color: '#34495e',
                                    backgroundColor: '#f9fafc',
                                    minHeight: '120px',
                                    resize: 'vertical',
                                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#3498db';
                                    e.target.style.boxShadow = '0 0 5px rgba(52, 152, 219, 0.3)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d9e6';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        <div
                            style={{
                                gridColumn: 'span 2',
                            }}
                        >
                            <label
                                style={{
                                    color: '#2c3e50',
                                    fontWeight: '600',
                                    marginBottom: '8px',
                                    display: 'block',
                                }}
                            >
                                Clinic Image
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    borderRadius: '10px',
                                    border: '1px solid #d1d9e6',
                                    fontSize: '1rem',
                                    color: '#34495e',
                                    backgroundColor: '#f9fafc',
                                    cursor: 'pointer',
                                }}
                            />
                        </div>
                        <div
                            style={{
                                gridColumn: 'span 2',
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: '20px',
                            }}
                        >
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: '12px 40px',
                                    background: loading ? '#95a5a6' : '#1e2a44',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'background 0.3s ease, transform 0.3s ease',
                                    boxShadow: loading ? 'none' : '0 4px 15px rgba(30, 42, 68, 0.2)',
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) {
                                        e.target.style.background = '#3498db';
                                        e.target.style.transform = 'scale(1.05)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) {
                                        e.target.style.background = '#1e2a44';
                                        e.target.style.transform = 'scale(1)';
                                    }
                                }}
                            >
                                {loading ? 'Updating...' : 'Update Profile'}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <p
                            style={{
                                color: '#e74c3c',
                                textAlign: 'center',
                                marginTop: '20px',
                                fontSize: '1rem',
                                fontWeight: '500',
                            }}
                        >
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;