import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewAllClinic = () => {
    const [clinics, setClinics] = useState([]);
    const [filteredClinics, setFilteredClinics] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const BASE_URL = "http://localhost:3031";

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/viewallclinics`);
                if (response.data.status === "success") {
                    setClinics(response.data.data);
                    setFilteredClinics(response.data.data);
                    console.log("Clinics Data:", response.data.data);
                } else {
                    console.error("Error fetching clinics");
                }
            } catch (error) {
                console.error("API Error:", error);
            }
        };
        fetchClinics();
    }, []);

    const handleSearch = () => {
        const lowercasedSearch = searchTerm.toLowerCase().trim();
        const filtered = clinics.filter((clinic) =>
            clinic.clinicName.toLowerCase().includes(lowercasedSearch) ||
            clinic.city.toLowerCase().includes(lowercasedSearch) ||
            clinic.state.toLowerCase().includes(lowercasedSearch)
        );
        setFilteredClinics(filtered);
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value === "") {
            setFilteredClinics(clinics);
        }
    };

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, #ecf0f1 0%, #dfe4ea 100%)',
            minHeight: '100vh',
            padding: '40px 20px',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <div style={{
                maxWidth: '1400px',
                width: '100%',
                position: 'relative'
            }}>
                {/* Back Button */}
                <button
                    onClick={handleBack}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        padding: '12px 20px',
                        background: '#2c3e50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.3s ease, transform 0.2s, box-shadow 0.3s ease',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                        zIndex: 10
                    }}
                    onMouseEnter={(e) => { e.target.style.background = '#34495e'; e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.25)'; }}
                    onMouseLeave={(e) => { e.target.style.background = '#2c3e50'; e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)'; }}
                >
                    ← Back
                </button>

                {/* Title */}
                <h2 style={{
                    textAlign: 'center',
                    marginTop: '60px',
                    marginBottom: '40px',
                    color: '#2c3e50',
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: '700',
                    fontSize: '2.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    All Clinics
                </h2>

                {/* Search Section */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '50px',
                    gap: '20px'
                }}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleInputChange}
                        placeholder="Search by clinic name, city, or state"
                        style={{
                            width: '350px',
                            padding: '14px 20px',
                            borderRadius: '12px',
                            border: '1px solid #34495e',
                            fontSize: '1.1rem',
                            outline: 'none',
                            background: '#f9fbfc',
                            color: '#2c3e50',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                            transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                        }}
                        onFocus={(e) => { e.target.style.borderColor = '#3498db'; e.target.style.boxShadow = '0 4px 15px rgba(52, 152, 219, 0.3)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#34495e'; e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)'; }}
                    />
                    <button
                        onClick={handleSearch}
                        style={{
                            padding: '14px 30px',
                            background: '#2c3e50',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background 0.3s ease, transform 0.2s, box-shadow 0.3s ease',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
                        }}
                        onMouseEnter={(e) => { e.target.style.background = '#34495e'; e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.25)'; }}
                        onMouseLeave={(e) => { e.target.style.background = '#2c3e50'; e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)'; }}
                    >
                        Search
                    </button>
                </div>

                {/* Clinic Cards */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '30px',
                    justifyContent: 'center'
                }}>
                    {filteredClinics.length > 0 ? (
                        filteredClinics.map((clinic) => {
                            const imageUrl = clinic.image.startsWith("/")
                                ? `${BASE_URL}${clinic.image}`
                                : clinic.image;

                            return (
                                <div key={clinic._id} style={{
                                    width: '320px',
                                    background: '#fff',
                                    borderRadius: '20px',
                                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                                    overflow: 'hidden',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    border: '2px solid #2c3e50'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.25)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                                }}>
                                    <img
                                        src={imageUrl}
                                        alt={`Clinic ${clinic.clinicName}`}
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover',
                                            borderBottom: '2px solid #34495e'
                                        }}
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/200";
                                        }}
                                    />
                                    <div style={{
                                        padding: '25px',
                                        background: '#fff'
                                    }}>
                                        <h5 style={{
                                            margin: '0 0 15px 0',
                                            color: '#2c3e50',
                                            fontSize: '1.6rem',
                                            fontWeight: '700',
                                            fontFamily: 'Arial, sans-serif',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {clinic.clinicName}
                                        </h5>
                                        <div style={{
                                            color: '#34495e',
                                            fontSize: '1rem',
                                            lineHeight: '1.7'
                                        }}>
                                            <p style={{ margin: '0 0 10px' }}>
                                                <strong style={{ color: '#2c3e50', fontWeight: '600' }}>Email:</strong> {clinic.email}
                                            </p>
                                            <p style={{ margin: '0 0 10px' }}>
                                                <strong style={{ color: '#2c3e50', fontWeight: '600' }}>Phone:</strong> {clinic.phone}
                                            </p>
                                            <p style={{ margin: '0 0 10px' }}>
                                                <strong style={{ color: '#2c3e50', fontWeight: '600' }}>Address:</strong> {clinic.address}, {clinic.city}, {clinic.state}
                                            </p>
                                            <p style={{ margin: '0' }}>
                                                <strong style={{ color: '#2c3e50', fontWeight: '600' }}>Experience:</strong> {clinic.experienceYears} years
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/ClinicDetails/${clinic._id}`)}
                                            style={{
                                                width: '100%',
                                                padding: '14px',
                                                marginTop: '25px',
                                                background: '#2c3e50',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '12px',
                                                fontSize: '1.1rem',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                transition: 'background 0.3s ease, transform 0.2s, box-shadow 0.3s ease',
                                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
                                            }}
                                            onMouseEnter={(e) => { e.target.style.background = '#34495e'; e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.25)'; }}
                                            onMouseLeave={(e) => { e.target.style.background = '#2c3e50'; e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)'; }}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p style={{
                            textAlign: 'center',
                            color: '#34495e',
                            fontSize: '1.5rem',
                            fontStyle: 'italic',
                            width: '100%',
                            padding: '40px',
                            background: '#fff',
                            borderRadius: '20px',
                            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                            border: '2px solid #2c3e50'
                        }}>
                            No clinics found matching your search.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewAllClinic;