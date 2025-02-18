import React, { useState } from "react";
import axios from "axios";

const UserReg = () => {
  const [data, setData] = useState({
    UName: "",
    Email: "",
    Password: "",
    Phone: "",
    uaddress: "",
    state: "",
    City: "",
    Gender: "",
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
      setData({ ...data, state: value, City: "" }); // Reset city when state changes
    }
  };

  const handleSubmit = async () => {
    if (
      !data.UName ||
      !data.Email ||
      !data.Password ||
      !data.Phone ||
      !data.uaddress ||
      !data.state ||
      !data.City ||
      !data.Gender
    ) {
      alert("All fields are required!");
      return;
    }

    if (data.Phone.length !== 10 || isNaN(data.Phone)) {
      alert("Phone number must be 10 digits!");
      return;
    }

    if (data.Password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3031/usersignup", data);
      if (response.data.status === "success") {
        alert("Registration successful!");
        setData({
          UName: "",
          Email: "",
          Password: "",
          Phone: "",
          uaddress: "",
          state: "",
          City: "",
          Gender: "",
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          backgroundColor: "#ffffff",
          borderRadius: "15px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "30px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#007bff",
            fontSize: "2rem",
            fontWeight: "bold",
          }}
        >
          User Registration
        </h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
          }}
        >
          <div>
            <label style={{ fontWeight: "500", marginBottom: "5px" }}>User Name:</label>
            <input
              type="text"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                transition: "border-color 0.3s ease",
              }}
              name="UName"
              value={data.UName}
              onChange={inputHandler}
              required
            />
          </div>
          <div>
            <label style={{ fontWeight: "500", marginBottom: "5px" }}>Email:</label>
            <input
              type="email"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                transition: "border-color 0.3s ease",
              }}
              name="Email"
              value={data.Email}
              onChange={inputHandler}
              required
            />
          </div>
          <div>
            <label style={{ fontWeight: "500", marginBottom: "5px" }}>Password:</label>
            <input
              type="password"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                transition: "border-color 0.3s ease",
              }}
              name="Password"
              value={data.Password}
              onChange={inputHandler}
              required
            />
          </div>
          <div>
            <label style={{ fontWeight: "500", marginBottom: "5px" }}>Phone:</label>
            <input
              type="text"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                transition: "border-color 0.3s ease",
              }}
              name="Phone"
              value={data.Phone}
              onChange={inputHandler}
              required
            />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontWeight: "500", marginBottom: "5px" }}>Address:</label>
            <input
              type="text"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                transition: "border-color 0.3s ease",
              }}
              name="uaddress"
              value={data.uaddress}
              onChange={inputHandler}
              required
            />
          </div>
          <div>
            <label style={{ fontWeight: "500", marginBottom: "5px" }}>State:</label>
            <select
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                transition: "border-color 0.3s ease",
              }}
              name="state"
              value={data.state}
              onChange={inputHandler}
              required
            >
              <option value="">Select State</option>
              {Object.keys(stateCityMap).map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: "500", marginBottom: "5px" }}>City:</label>
            <select
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                transition: "border-color 0.3s ease",
              }}
              name="City"
              value={data.City}
              onChange={inputHandler}
              required
              disabled={!data.state}
            >
              <option value="">Select City</option>
              {data.state &&
                stateCityMap[data.state].map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: "500", marginBottom: "5px" }}>Gender:</label>
            <select
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                transition: "border-color 0.3s ease",
              }}
              name="Gender"
              value={data.Gender}
              onChange={inputHandler}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            style={{
              backgroundColor: "#007bff",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onClick={handleSubmit}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserReg;