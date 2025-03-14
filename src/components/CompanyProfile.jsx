import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ComNav from './ComNav';

const CompanyProfile = () => {
    const navigate = useNavigate();
    const companyId = sessionStorage.getItem('companyId');
    const [companyData, setCompanyData] = useState({
        companyName: '',
        email: '',
        phone: '',
        address: '',
        state: '',
        city: '',
        zipCode: '',
        registrationNumber: '',
        aboutCompany: '',
        establishedYear: '',
        companyType: '',
        brandLogo: ''
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompanyData = async () => {
            if (!companyId) {
                setError('No company ID found. Redirecting to login...');
                setTimeout(() => navigate('/company-login'), 2000);
                return;
            }
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`http://localhost:3031/api/company/${companyId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.status === 'success') {
                    setCompanyData(response.data.data);
                } else {
                    setError(response.data.message || 'Failed to fetch company data');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred while fetching company data');
                console.error(err);
            }
        };
        fetchCompanyData();
    }, [companyId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompanyData({ ...companyData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        Object.keys(companyData).forEach(key => {
            if (key !== 'brandLogo') formData.append(key, companyData[key]);
        });
        if (file) formData.append('brandLogo', file);

        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.put(`http://localhost:3031/api/company/${companyId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.status === 'success') {
                Object.keys(response.data.data).forEach(key => {
                    sessionStorage.setItem(key, response.data.data[key]);
                });
                setCompanyData(response.data.data);
                alert('Company profile updated successfully!');
                navigate('/CompanyDash');
            } else {
                setError(response.data.message || 'Failed to update company profile');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while updating company profile');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
            {/* Sidebar Navigation */}
            <ComNav />

            {/* Main Content */}
            <div
                style={{
                    marginLeft: '250px',
                    flexGrow: 1,
                    padding: '40px',
                    backgroundColor: '#f1f5f9',
                    fontFamily: "'Poppins', sans-serif",
                }}
            >
                <div
                    style={{
                        maxWidth: '800px',
                        margin: '0 auto',
                        backgroundColor: '#1e2a44', // Dark blue theme
                        borderRadius: '12px',
                        padding: '40px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                        color: '#fff',
                    }}
                >
                    <h2
                        style={{
                            textAlign: 'center',
                            fontSize: '2rem',
                            fontWeight: '700',
                            marginBottom: '40px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                        }}
                    >
                        Company Profile
                    </h2>

                    {companyData.brandLogo && companyData.brandLogo !== '' && (
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <img
                                src={`http://localhost:3031${companyData.brandLogo}`}
                                alt="Brand Logo"
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '3px solid #3498db',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                                    transition: 'transform 0.3s ease',
                                }}
                                onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
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
                        {[
                            { label: 'Company Name', name: 'companyName', type: 'text', required: true },
                            { label: 'Email', name: 'email', type: 'email', required: true },
                            { label: 'Phone', name: 'phone', type: 'text', required: true },
                            { label: 'Address', name: 'address', type: 'text', required: true },
                            { label: 'State', name: 'state', type: 'text', required: true },
                            { label: 'City', name: 'city', type: 'text', required: true },
                            { label: 'Zip Code', name: 'zipCode', type: 'text', required: true },
                            { label: 'Registration Number', name: 'registrationNumber', type: 'text', required: true },
                            { label: 'Established Year', name: 'establishedYear', type: 'number', required: true },
                        ].map((field) => (
                            <div key={field.name}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#d1d5db' }}>
                                    {field.label}
                                </label>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={companyData[field.name]}
                                    onChange={handleChange}
                                    required={field.required}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #2c3e50',
                                        backgroundColor: '#2c3e50',
                                        color: '#fff',
                                        fontSize: '1rem',
                                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#3498db';
                                        e.target.style.boxShadow = '0 0 5px rgba(52, 152, 219, 0.5)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#2c3e50';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        ))}

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#d1d5db' }}>
                                Company Type
                            </label>
                            <select
                                name="companyType"
                                value={companyData.companyType}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #2c3e50',
                                    backgroundColor: '#2c3e50',
                                    color: '#fff',
                                    fontSize: '1rem',
                                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#3498db';
                                    e.target.style.boxShadow = '0 0 5px rgba(52, 152, 219, 0.5)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#2c3e50';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                <option value="" style={{ color: '#d1d5db' }}>Select Type</option>
                                <option value="Manufacturer">Manufacturer</option>
                                <option value="Distributor">Distributor</option>
                                <option value="Retailer">Retailer</option>
                            </select>
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#d1d5db' }}>
                                About Company
                            </label>
                            <textarea
                                name="aboutCompany"
                                value={companyData.aboutCompany}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #2c3e50',
                                    backgroundColor: '#2c3e50',
                                    color: '#fff',
                                    fontSize: '1rem',
                                    minHeight: '100px',
                                    resize: 'vertical',
                                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#3498db';
                                    e.target.style.boxShadow = '0 0 5px rgba(52, 152, 219, 0.5)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#2c3e50';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#d1d5db' }}>
                                Brand Logo
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #2c3e50',
                                    backgroundColor: '#2c3e50',
                                    color: '#fff',
                                    fontSize: '1rem',
                                }}
                            />
                        </div>

                        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: '12px 40px',
                                    backgroundColor: loading ? '#6b7280' : '#3498db',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'background-color 0.3s ease, transform 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) e.target.style.backgroundColor = '#2980b9';
                                    e.target.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) e.target.style.backgroundColor = '#3498db';
                                    e.target.style.transform = 'scale(1)';
                                }}
                            >
                                {loading ? 'Updating...' : 'Update Profile'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/CompanyDash')}
                                style={{
                                    padding: '12px 40px',
                                    backgroundColor: '#2c3e50',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease, transform 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#e74c3c';
                                    e.target.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#2c3e50';
                                    e.target.style.transform = 'scale(1)';
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>

                    {error && (
                        <p
                            style={{
                                textAlign: 'center',
                                color: '#e74c3c',
                                fontSize: '1.1rem',
                                marginTop: '20px',
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

export default CompanyProfile;