import React, { useState } from "react";
import axios from "axios";

const ClinicReg = () => {
  const [data, setData] = useState({
    clinicName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    state: "",
    city: "",
    licenseNumber: "",
    experienceYears: "",
    description: "",
  });

  const stateCityMap = {
    Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    Karnataka: ["Bengaluru", "Mysuru", "Mangalore"],
  };

  const inputHandler = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });

    if (name === "state") {
      setData({ ...data, state: value, city: "" }); // Reset city when state changes
    }
  };

  const handleSubmit = async () => {
    if (
      !data.clinicName ||
      !data.email ||
      !data.password ||
      !data.phone ||
      !data.address ||
      !data.state ||
      !data.city ||
      !data.licenseNumber ||
      !data.experienceYears
    ) {
      alert("All fields are required!");
      return;
    }

    if (data.phone.length !== 10 || isNaN(data.phone)) {
      alert("Phone number must be 10 digits!");
      return;
    }

    if (data.password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3031/clinic-signup", data);
      if (response.data.status === "success") {
        alert("Clinic registration successful!");
        setData({
          clinicName: "",
          email: "",
          password: "",
          phone: "",
          address: "",
          state: "",
          city: "",
          licenseNumber: "",
          experienceYears: "",
          description: "",
        });
      } else if (response.data.status === "email already exists") {
        alert("Email already exists! Try another.");
      } else {
        alert("Error occurred. Try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Server error. Try again later.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f8f9fa", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "800px", backgroundColor: "#ffffff", borderRadius: "15px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", padding: "30px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#007bff", fontSize: "2rem", fontWeight: "bold" }}>Clinic Registration</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
          {["clinicName", "email", "password", "phone", "address", "licenseNumber", "experienceYears"].map((field) => (
            <div key={field} style={{ gridColumn: field === "address" ? "span 2" : "auto" }}>
              <label style={{ fontWeight: "500", marginBottom: "5px" }}>{field.replace(/([A-Z])/g, " $1").trim()}:</label>
              <input
                type={field === "password" ? "password" : "text"}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ced4da" }}
                name={field}
                value={data[field]}
                onChange={inputHandler}
                required
              />
            </div>
          ))}
          <div>
            <label style={{ fontWeight: "500", marginBottom: "5px" }}>State:</label>
            <select style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ced4da" }} name="state" value={data.state} onChange={inputHandler} required>
              <option value="">Select State</option>
              {Object.keys(stateCityMap).map((state, index) => (
                <option key={index} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: "500", marginBottom: "5px" }}>City:</label>
            <select style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ced4da" }} name="city" value={data.city} onChange={inputHandler} required disabled={!data.state}>
              <option value="">Select City</option>
              {data.state && stateCityMap[data.state].map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontWeight: "500", marginBottom: "5px" }}>Description:</label>
            <textarea style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ced4da" }} name="description" value={data.description} onChange={inputHandler}></textarea>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button style={{ backgroundColor: "#007bff", color: "#ffffff", padding: "12px 24px", borderRadius: "8px", border: "none", fontSize: "1rem", cursor: "pointer" }} onClick={handleSubmit}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicReg;
