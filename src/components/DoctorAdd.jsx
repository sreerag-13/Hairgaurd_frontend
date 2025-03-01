import React, { useState } from 'react';
import axios from 'axios';

const DoctorAdd = () => {
    const [doctorData, setDoctorData] = useState({
        DoctorName: "",
        qualification: "",
        specialization: "",
        phone: "",
        experience: "",
        availability: ""
    });

    const token = sessionStorage.getItem("token");

    const qualifications = [
        "MBBS + MD (Dermatology)", "MBBS + MD (Trichology)", 
        "Diploma in Dermatology", "Diploma in Trichology", 
        "MSc in Trichology", "Certified Trichologist", 
        "Fellowship in Hair Transplant Surgery", "Cosmetic Dermatology Certification"
    ];

    const specializations = [
        "Dermatology", "Trichology", "Hair Transplant Surgery", 
        "Scalp Treatment", "Hair Loss & Regrowth Therapy", 
        "Alopecia Treatment", "Wig & Hair Prosthesis Consultation", 
        "Laser Hair Therapy"
    ];

    const handleInputChange = (e) => {
        setDoctorData({ ...doctorData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!token) {
            alert("Access Denied: No Token Provided");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3031/add-doctor", doctorData, {
                headers: { Authorization: token }
            });
            alert("Doctor added successfully!");
            setDoctorData({
                DoctorName: "",
                qualification: "",
                specialization: "",
                phone: "",
                experience: "",
                availability: ""
            });
        } catch (error) {
            console.error("Error adding doctor:", error);
            alert(error.response?.data?.message || "Failed to add doctor. Please try again.");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Add Doctor</h2>
            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-12">
                        <label className="form-label">Doctor Name</label>
                        <input 
                            type="text" 
                            name="DoctorName" 
                            value={doctorData.DoctorName} 
                            onChange={handleInputChange} 
                            className="form-control" 
                            required 
                        />
                    </div>
                    <div className="col-sm-6">
                        <label className="form-label">Qualification</label>
                        <select 
                            name="qualification" 
                            value={doctorData.qualification} 
                            onChange={handleInputChange} 
                            className="form-select" 
                            required
                        >
                            <option value="">Select Qualification</option>
                            {qualifications.map((qual, index) => (
                                <option key={index} value={qual}>{qual}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-sm-6">
                        <label className="form-label">Specialization</label>
                        <select 
                            name="specialization" 
                            value={doctorData.specialization} 
                            onChange={handleInputChange} 
                            className="form-select" 
                            required
                        >
                            <option value="">Select Specialization</option>
                            {specializations.map((spec, index) => (
                                <option key={index} value={spec}>{spec}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-sm-6">
                        <label className="form-label">Phone Number</label>
                        <input 
                            type="text" 
                            name="phone" 
                            value={doctorData.phone} 
                            onChange={handleInputChange} 
                            className="form-control" 
                            required 
                        />
                    </div>
                    <div className="col-sm-6">
                        <label className="form-label">Experience (Years)</label>
                        <input 
                            type="number" 
                            name="experience" 
                            value={doctorData.experience} 
                            onChange={handleInputChange} 
                            className="form-control" 
                            required 
                            min="0" 
                        />
                    </div>
                    <div className="col-12">
                        <label className="form-label">Availability</label>
                        <input 
                            type="text" 
                            name="availability" 
                            value={doctorData.availability} 
                            onChange={handleInputChange} 
                            className="form-control" 
                            required 
                            placeholder="E.g., Mon-Fri, 9 AM - 5 PM" 
                        />
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" className="btn btn-primary w-50">
                            Add Doctor
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default DoctorAdd;
