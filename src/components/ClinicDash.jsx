import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorNav from './DoctorNav';

const ClinicDash = () => {
    const navigate = useNavigate();
    const [clinic, setClinic] = useState({
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

    useEffect(() => {
        // Fetching data from sessionStorage
        const storedImage = sessionStorage.getItem("image"); // This should be just the filename, e.g., "image1"
        
        setClinic({
            clinicName: sessionStorage.getItem("clinicName") || "N/A",
            email: sessionStorage.getItem("email") || "N/A",
            phone: sessionStorage.getItem("phone") || "N/A",
            address: sessionStorage.getItem("address") || "N/A",
            state: sessionStorage.getItem("state") || "N/A",
            city: sessionStorage.getItem("city") || "N/A",
            licenseNumber: sessionStorage.getItem("licenseNumber") || "N/A",
            experienceYears: sessionStorage.getItem("experienceYears") || "N/A",
            description: sessionStorage.getItem("description") || "No description available",
            image: storedImage ? `http://localhost:3031/uploads/${storedImage}` : "" // Construct the full image URL
        });
    }, []);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/clinic-login');
    };

    return (
        <div>
            <DoctorNav/>
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2>Welcome, {clinic.clinicName}</h2>

            {/* Display Clinic Image */}
            <div style={{ marginBottom: "20px" }}>
                {clinic.image ? (
                    <img 
                        src={clinic.image} 
                        alt="Clinic" 
                        style={{ width: "150px", height: "150px", borderRadius: "10px", objectFit: "cover" }}
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150"; // Fallback image
                            console.error("Image failed to load:", clinic.image); // Log the error
                        }}
                    />
                ) : (
                    <p>No Image Available</p>
                )}
            </div>

            {/* Display Clinic Details */}
            <p><strong>Email:</strong> {clinic.email}</p>
            <p><strong>Phone:</strong> {clinic.phone}</p>
            <p><strong>Address:</strong> {clinic.address}, {clinic.city}, {clinic.state}</p>
            <p><strong>License Number:</strong> {clinic.licenseNumber}</p>
            <p><strong>Experience Years:</strong> {clinic.experienceYears} years</p>
            <p><strong>Description:</strong> {clinic.description}</p>

            {/* Logout Button */}
            <button 
                onClick={handleLogout} 
                style={{
                    backgroundColor: "#dc3545",
                    color: "#ffffff",
                    padding: "10px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "16px",
                    marginTop: "20px"
                }}
            >
                Logout
            </button>
        </div>
   
        </div>
    );
};

export default ClinicDash;