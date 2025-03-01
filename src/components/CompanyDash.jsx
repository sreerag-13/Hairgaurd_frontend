import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CompanyDash = () => {
    const navigate = useNavigate();
    const [company, setCompany] = useState({
        companyName: "",
        email: "",
        phone: "",
        address: "",
        state: "",
        city: "",
        zipCode: "",
        registrationNumber: "",
        aboutCompany: "",
        establishedYear: "",
        companyType: "",
        brandLogo: "",
    });

    useEffect(() => {
        let storedLogo = sessionStorage.getItem("brandLogo");

        setCompany({
            companyName: sessionStorage.getItem("companyName") || "N/A",
            email: sessionStorage.getItem("email") || "N/A",
            phone: sessionStorage.getItem("phone") || "N/A",
            address: sessionStorage.getItem("address") || "N/A",
            state: sessionStorage.getItem("state") || "N/A",
            city: sessionStorage.getItem("city") || "N/A",
            zipCode: sessionStorage.getItem("zipCode") || "N/A",
            registrationNumber: sessionStorage.getItem("registrationNumber") || "N/A",
            aboutCompany: sessionStorage.getItem("aboutCompany") || "No description available",
            establishedYear: sessionStorage.getItem("establishedYear") || "N/A",
            companyType: sessionStorage.getItem("companyType") || "N/A",
            brandLogo: storedLogo || "https://via.placeholder.com/150",
        });
    }, []);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/company-login");
    };

    return (
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px", backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
            <div style={{ backgroundColor: "#ffffff", borderRadius: "20px", boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)", padding: "30px", marginBottom: "40px" }}>
                <h2 style={{ color: "#004d40", fontSize: "36px", fontWeight: "700", textAlign: "center", marginBottom: "20px" }}>
                    Welcome, {company.companyName}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "40px", flexWrap: "wrap" }}>
                    <img
                        src={company.brandLogo}
                        alt="Brand Logo"
                        style={{
                            width: "250px",
                            height: "250px",
                            objectFit: "contain",
                            borderRadius: "15px",
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                            backgroundColor: "#fff",
                        }}
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150";
                            console.error("Failed to load logo:", company.brandLogo);
                        }}
                    />
                    <div style={{ flex: "1", minWidth: "300px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "15px", fontSize: "18px", color: "#004d40" }}>
                            <span style={{ fontWeight: "600" }}>Email:</span><span>{company.email}</span>
                            <span style={{ fontWeight: "600" }}>Phone:</span><span>{company.phone}</span>
                            <span style={{ fontWeight: "600" }}>Address:</span><span>{company.address}, {company.city}, {company.state}, {company.zipCode}</span>
                            <span style={{ fontWeight: "600" }}>Registration:</span><span>{company.registrationNumber}</span>
                            <span style={{ fontWeight: "600" }}>Established:</span><span>{company.establishedYear}</span>
                            <span style={{ fontWeight: "600" }}>Type:</span><span>{company.companyType}</span>
                            <span style={{ fontWeight: "600" }}>About:</span><span style={{ lineHeight: "1.5" }}>{company.aboutCompany}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ textAlign: "center" }}>
                <button
                    onClick={handleLogout}
                    style={{
                        backgroundColor: "#ff6f61",
                        color: "#fff",
                        padding: "12px 25px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "16px",
                        fontWeight: "500",
                        transition: "background-color 0.3s ease",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e65b50")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ff6f61")}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default CompanyDash;