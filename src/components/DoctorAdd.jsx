import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoctorNav from './DoctorNav';

const DoctorAdd = () => {
    const [doctorData, setDoctorData] = useState({
        DoctorName: '',
        qualification: '',
        specialization: '',
        phone: '',
        experience: '',
        availability: ''
    });
    const [doctors, setDoctors] = useState([]);
    const [editDoctorId, setEditDoctorId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const token = sessionStorage.getItem('token');
    const clinicId = sessionStorage.getItem('_id');

    const qualifications = [
        'MBBS + MD (Dermatology)', 'MBBS + MD (Trichology)', 
        'Diploma in Dermatology', 'Diploma in Trichology', 
        'MSc in Trichology', 'Certified Trichologist', 
        'Fellowship in Hair Transplant Surgery', 'Cosmetic Dermatology Certification'
    ];

    const specializations = [
        'Dermatology', 'Trichology', 'Hair Transplant Surgery', 
        'Scalp Treatment', 'Hair Loss & Regrowth Therapy', 
        'Alopecia Treatment', 'Wig & Hair Prosthesis Consultation', 
        'Laser Hair Therapy'
    ];

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        if (!token || !clinicId) {
            setError('Access Denied: No Token or Clinic ID Provided');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3031/clinic/${clinicId}/doctors`, {
                headers: { Authorization: token }
            });
            if (response.data.status === 'success') {
                setDoctors(response.data.data);
            } else {
                setError('Failed to fetch doctors');
            }
        } catch (err) {
            setError('Error fetching doctors: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setDoctorData({ ...doctorData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token || !clinicId) {
            alert('Access Denied: No Token or Clinic ID Provided');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3031/add-doctor', 
                { ...doctorData }, 
                { headers: { Authorization: token } }
            );
            alert('Doctor added successfully!');
            setDoctorData({
                DoctorName: '',
                qualification: '',
                specialization: '',
                phone: '',
                experience: '',
                availability: ''
            });
            fetchDoctors();
        } catch (error) {
            console.error('Error adding doctor:', error);
            alert(error.response?.data?.message || 'Failed to add doctor.');
        }
    };

    const handleEdit = (doctor) => {
        setEditDoctorId(doctor._id);
        setDoctorData({
            DoctorName: doctor.DoctorName[0],
            qualification: doctor.qualification,
            specialization: doctor.specialization,
            phone: doctor.phone,
            experience: doctor.experience,
            availability: doctor.availability
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!token || !editDoctorId) {
            alert('Access Denied or No Doctor Selected');
            return;
        }
        try {
            const response = await axios.put(`http://localhost:3031/doctor/${editDoctorId}`, 
                { ...doctorData, DoctorName: [doctorData.DoctorName] }, 
                { headers: { Authorization: token } }
            );
            alert('Doctor updated successfully!');
            setEditDoctorId(null);
            setDoctorData({
                DoctorName: '',
                qualification: '',
                specialization: '',
                phone: '',
                experience: '',
                availability: ''
            });
            fetchDoctors();
        } catch (error) {
            console.error('Error updating doctor:', error);
            alert(error.response?.data?.message || 'Failed to update doctor.');
        }
    };

    const handleDelete = async (doctorId) => {
        if (!token) {
            alert('Access Denied: No Token Provided');
            return;
        }
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            try {
                await axios.delete(`http://localhost:3031/doctor/${doctorId}`, {
                    headers: { Authorization: token }
                });
                alert('Doctor deleted successfully!');
                fetchDoctors();
            } catch (error) {
                console.error('Error deleting doctor:', error);
                alert(error.response?.data?.message || 'Failed to delete doctor.');
            }
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
                        maxWidth: '1000px',
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
                        {editDoctorId ? 'Update Doctor' : 'Add Doctor'}
                    </h2>
                    <form
                        onSubmit={editDoctorId ? handleUpdate : handleSubmit}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '20px',
                            marginBottom: '40px',
                        }}
                    >
                        <div>
                            <label style={{ color: '#2c3e50', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                                Doctor Name
                            </label>
                            <input
                                type="text"
                                name="DoctorName"
                                value={doctorData.DoctorName}
                                onChange={handleInputChange}
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
                            <label style={{ color: '#2c3e50', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                                Qualification
                            </label>
                            <select
                                name="qualification"
                                value={doctorData.qualification}
                                onChange={handleInputChange}
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
                            >
                                <option value="">Select Qualification</option>
                                {qualifications.map((qual, index) => (
                                    <option key={index} value={qual}>{qual}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ color: '#2c3e50', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                                Specialization
                            </label>
                            <select
                                name="specialization"
                                value={doctorData.specialization}
                                onChange={handleInputChange}
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
                            >
                                <option value="">Select Specialization</option>
                                {specializations.map((spec, index) => (
                                    <option key={index} value={spec}>{spec}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ color: '#2c3e50', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                                Phone Number
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={doctorData.phone}
                                onChange={handleInputChange}
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
                            <label style={{ color: '#2c3e50', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                                Experience (Years)
                            </label>
                            <input
                                type="number"
                                name="experience"
                                value={doctorData.experience}
                                onChange={handleInputChange}
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
                            <label style={{ color: '#2c3e50', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                                Availability
                            </label>
                            <input
                                type="text"
                                name="availability"
                                value={doctorData.availability}
                                onChange={handleInputChange}
                                required
                                placeholder="E.g., Mon-Fri, 9 AM - 5 PM"
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
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '20px',
                                marginTop: '20px',
                            }}
                        >
                            <button
                                type="submit"
                                style={{
                                    padding: '12px 30px',
                                    background: '#1e2a44',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background 0.3s ease, transform 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(30, 42, 68, 0.2)',
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = '#3498db';
                                    e.target.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = '#1e2a44';
                                    e.target.style.transform = 'scale(1)';
                                }}
                            >
                                {editDoctorId ? 'Update Doctor' : 'Add Doctor'}
                            </button>
                            {editDoctorId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditDoctorId(null);
                                        setDoctorData({
                                            DoctorName: '',
                                            qualification: '',
                                            specialization: '',
                                            phone: '',
                                            experience: '',
                                            availability: ''
                                        });
                                    }}
                                    style={{
                                        padding: '12px 30px',
                                        background: '#e74c3c',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontSize: '1.1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'background 0.3s ease, transform 0.3s ease',
                                        boxShadow: '0 4px 15px rgba(231, 76, 60, 0.2)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = '#c0392b';
                                        e.target.style.transform = 'scale(1.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = '#e74c3c';
                                        e.target.style.transform = 'scale(1)';
                                    }}
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>

                    <h3
                        style={{
                            color: '#1e2a44',
                            fontSize: '2rem',
                            fontWeight: '700',
                            marginTop: '40px',
                            marginBottom: '30px',
                            textAlign: 'center',
                            textTransform: 'uppercase',
                        }}
                    >
                        Doctors List
                    </h3>
                    {loading ? (
                        <p style={{ textAlign: 'center', color: '#7f8c8d', fontSize: '1.2rem' }}>Loading doctors...</p>
                    ) : error ? (
                        <p style={{ textAlign: 'center', color: '#e74c3c', fontSize: '1.2rem' }}>{error}</p>
                    ) : doctors.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#7f8c8d', fontSize: '1.2rem' }}>No doctors added yet.</p>
                    ) : (
                        <div style={{ overflowX: 'auto', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <table
                                style={{
                                    width: '100%',
                                    borderCollapse: 'separate',
                                    borderSpacing: 0,
                                    background: '#fff',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                }}
                            >
                                <thead>
                                    <tr style={{ background: '#1e2a44', color: '#fff' }}>
                                        <th style={{ padding: '15px', fontWeight: '600', textAlign: 'left' }}>Name</th>
                                        <th style={{ padding: '15px', fontWeight: '600', textAlign: 'left' }}>Qualification</th>
                                        <th style={{ padding: '15px', fontWeight: '600', textAlign: 'left' }}>Specialization</th>
                                        <th style={{ padding: '15px', fontWeight: '600', textAlign: 'left' }}>Phone</th>
                                        <th style={{ padding: '15px', fontWeight: '600', textAlign: 'left' }}>Experience</th>
                                        <th style={{ padding: '15px', fontWeight: '600', textAlign: 'left' }}>Availability</th>
                                        <th style={{ padding: '15px', fontWeight: '600', textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {doctors.map((doctor, index) => (
                                        <tr
                                            key={doctor._id}
                                            style={{
                                                background: index % 2 === 0 ? '#f9fafc' : '#fff',
                                                transition: 'background 0.3s ease',
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = '#eef2f3')}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = index % 2 === 0 ? '#f9fafc' : '#fff')}
                                        >
                                            <td style={{ padding: '15px', color: '#34495e' }}>{doctor.DoctorName[0]}</td>
                                            <td style={{ padding: '15px', color: '#34495e' }}>{doctor.qualification}</td>
                                            <td style={{ padding: '15px', color: '#34495e' }}>{doctor.specialization}</td>
                                            <td style={{ padding: '15px', color: '#34495e' }}>{doctor.phone}</td>
                                            <td style={{ padding: '15px', color: '#34495e' }}>{doctor.experience}</td>
                                            <td style={{ padding: '15px', color: '#34495e' }}>{doctor.availability}</td>
                                            <td style={{ padding: '15px', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => handleEdit(doctor)}
                                                    style={{
                                                        padding: '8px 20px',
                                                        background: '#f1c40f',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        fontSize: '1rem',
                                                        fontWeight: '500',
                                                        cursor: 'pointer',
                                                        marginRight: '10px',
                                                        transition: 'background 0.3s ease, transform 0.3s ease',
                                                        boxShadow: '0 2px 10px rgba(241, 196, 15, 0.2)',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.background = '#e67e22';
                                                        e.target.style.transform = 'scale(1.05)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.background = '#f1c40f';
                                                        e.target.style.transform = 'scale(1)';
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(doctor._id)}
                                                    style={{
                                                        padding: '8px 20px',
                                                        background: '#e74c3c',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        fontSize: '1rem',
                                                        fontWeight: '500',
                                                        cursor: 'pointer',
                                                        transition: 'background 0.3s ease, transform 0.3s ease',
                                                        boxShadow: '0 2px 10px rgba(231, 76, 60, 0.2)',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.background = '#c0392b';
                                                        e.target.style.transform = 'scale(1.05)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.background = '#e74c3c';
                                                        e.target.style.transform = 'scale(1)';
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorAdd;