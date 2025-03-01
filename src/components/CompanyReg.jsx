import React, { useState } from "react";
import axios from "axios";

const CompanyReg = () => {
  const [data, setData] = useState({
    companyName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    state: "",
    city: "",
    zipCode: "",
    registrationNumber: "",
    aboutCompany: "",
    establishedYear: "",
    companyType: "",
  });

  const [brandLogo, setBrandLogo] = useState(null);

  const stateCityMap = {
    Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    Karnataka: ["Bengaluru", "Mysuru", "Mangalore"],
  };

  const inputHandler = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });

    if (name === "state") {
      setData({ ...data, state: value, city: "" });
    }
  };

  const imageHandler = (event) => {
    setBrandLogo(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (
      !data.companyName ||
      !data.email ||
      !data.password ||
      !data.phone ||
      !data.address ||
      !data.state ||
      !data.city ||
      !data.zipCode ||
      !data.registrationNumber ||
      !data.companyType ||
      !brandLogo
    ) {
      alert("All fields are required, including the brand logo!");
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
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      formData.append("brandLogo", brandLogo);

      const response = await axios.post("http://localhost:3031/company-signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status === "success") {
        alert("Company registration successful!");
        setData({
          companyName: "",
          email: "",
          password: "",
          phone: "",
          address: "",
          state: "",
          city: "",
          zipCode: "",
          registrationNumber: "",
          aboutCompany: "",
          establishedYear: "",
          companyType: "",
        });
        setBrandLogo(null);
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
        <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#007bff", fontSize: "2rem", fontWeight: "bold" }}>Company Registration</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
          {["companyName", "email", "password", "phone", "address", "zipCode", "registrationNumber", "aboutCompany", "establishedYear"].map((field) => (
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
          <div>
            <label style={{ fontWeight: "500", marginBottom: "5px" }}>Company Type:</label>
            <select style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ced4da" }} name="companyType" value={data.companyType} onChange={inputHandler} required>
              <option value="">Select Type</option>
              <option value="Manufacturer">Manufacturer</option>
              <option value="Distributor">Distributor</option>
              <option value="Retailer">Retailer</option>
            </select>
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontWeight: "500", marginBottom: "5px" }}>Brand Logo:</label>
            <input type="file" accept="image/*" onChange={imageHandler} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ced4da" }} />
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

export default CompanyReg;
