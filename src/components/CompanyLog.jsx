import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CompanyLog = () => {
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const inputHandler = (event) => {
        setLoginData({ ...loginData, [event.target.name]: event.target.value });
    };

    const loginCompany = () => {
        axios
            .post("http://localhost:3031/company-login", loginData)
            .then((response) => {
                if (response.data.status === "success") {
                    const company = response.data.company;

                    if (!company) {
                        alert("Error: Company data not received.");
                        return;
                    }

                    // Store company details in sessionStorage
                    sessionStorage.setItem("token", response.data.token);
                    sessionStorage.setItem("companyId", company._id);
                    sessionStorage.setItem("companyName", company.companyName);
                    sessionStorage.setItem("email", company.email);
                    sessionStorage.setItem("phone", company.phone);
                    sessionStorage.setItem("address", company.address);
                    sessionStorage.setItem("state", company.state);
                    sessionStorage.setItem("city", company.city);
                    sessionStorage.setItem("zipCode", company.zipCode);
                    sessionStorage.setItem("registrationNumber", company.registrationNumber);
                    sessionStorage.setItem("aboutCompany", company.aboutCompany || "No description available");
                    sessionStorage.setItem("establishedYear", company.establishedYear);
                    sessionStorage.setItem("companyType", company.companyType);
                    sessionStorage.setItem("brandLogo", company.brandLogo || "https://via.placeholder.com/150"); // Use full URL from response

                    alert("Login Successful");
                    navigate("/CompanyDash");
                } else {
                    alert(
                        response.data.status === "incorrect password"
                            ? "Incorrect Password"
                            : response.data.status === "incorrect email"
                            ? "Incorrect Email"
                            : "Login failed"
                    );
                }
            })
            .catch((error) => {
                console.error("Login Error:", error);
                alert("An error occurred during login");
            });
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f2f5", fontFamily: "Arial, sans-serif" }}>
            <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", width: "300px", textAlign: "center" }}>
                <h2 style={{ color: "#004d40", fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>Company Login</h2>
                <label style={{ display: "block", textAlign: "left", fontSize: "16px", color: "#555", marginBottom: "5px" }}>Email:</label>
                <input
                    type="text"
                    name="email"
                    value={loginData.email}
                    onChange={inputHandler}
                    style={{ width: "100%", padding: "10px", marginBottom: "15px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px" }}
                />
                <label style={{ display: "block", textAlign: "left", fontSize: "16px", color: "#555", marginBottom: "5px" }}>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={inputHandler}
                    style={{ width: "100%", padding: "10px", marginBottom: "20px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px" }}
                />
                <button
                    style={{
                        backgroundColor: "#007bff",
                        color: "#ffffff",
                        padding: "10px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "16px",
                        width: "100%",
                        transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
                    onClick={loginCompany}
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default CompanyLog;