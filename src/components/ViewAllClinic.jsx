import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewAllClinic = () => {
    const [clinics, setClinics] = useState([]);
    const navigate = useNavigate();
    const BASE_URL = "http://localhost:3031"; // Ensure this matches backend

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/viewallclinics`);
                if (response.data.status === "success") {
                    setClinics(response.data.data);
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

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">All Clinics</h2>

            <div className="row g-3">
                {clinics.length > 0 ? (
                    clinics.map((clinic) => {
                        const imageUrl = clinic.image.startsWith("/")
                            ? `${BASE_URL}${clinic.image}`
                            : clinic.image;

                        return (
                            <div key={clinic._id} className="col col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-3">
                                <div className="card h-100 shadow-sm">
                                    <img 
                                        src={imageUrl} 
                                        className="card-img-top" 
                                        alt={`Clinic ${clinic.clinicName}`}
                                        onError={(e) => { 
                                            e.target.src = "https://via.placeholder.com/150"; 
                                        }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{clinic.clinicName}</h5>
                                        <p className="card-text">
                                            <strong>Email:</strong> {clinic.email} <br />
                                            <strong>Phone:</strong> {clinic.phone} <br />
                                            <strong>Address:</strong> {clinic.address}, {clinic.city}, {clinic.state} <br />
                                            <strong>Experience:</strong> {clinic.experienceYears} years
                                        </p>
                                        <button 
                                            className="btn btn-primary"
                                            onClick={() => navigate(`/ClinicDetails/${clinic._id}`)} // ✅ Corrected Route
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center">No clinics available.</p>
                )}
            </div>
        </div>
    );
};

export default ViewAllClinic;
