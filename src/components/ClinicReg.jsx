import React, { useState, useEffect } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";

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
    image: "",
  });

  const [image, setImage] = useState(null); // Store the selected image
  const [otpEmail, setOtpEmail] = useState("");
  const [enteredOtpEmail, setEnteredOtpEmail] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // Single boolean for email OTP

  const stateCityMap = {
    Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    Karnataka: ["Bengaluru", "Mysuru", "Mangalore"],
  };

  // Initialize EmailJS with User ID
  useEffect(() => {
    emailjs.init("rNZMqWzKrnXVmrDs2"); // Your EmailJS User ID
  }, []);

  // Generate a 6-digit OTP
  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  const inputHandler = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
    if (name === "state") {
      setData({ ...data, state: value, city: "" });
    }
  };

  const imageHandler = (event) => {
    setImage(event.target.files[0]);
  };

  // Send OTP to Email using EmailJS
  const sendEmailOTP = async () => {
    const otp = generateOTP();
    setOtpEmail(otp);

    const emailParams = {
      to_email: data.email, // Matches {{to_email}} in EmailJS template
      user_name: data.clinicName, // Using clinicName as the name
      otp: otp,
    };

    try {
      await emailjs.send(
        "service_80dei54", // Your EmailJS Service ID
        "template_kfv83ib", // Reusing same template
        emailParams,
        "rNZMqWzKrnXVmrDs2" // Your EmailJS User ID
      );
      console.log("Email OTP sent to", data.email, ":", otp);
      return true;
    } catch (error) {
      console.error("Error sending email OTP:", error);
      alert("Failed to send email OTP. Check console for details.");
      return false;
    }
  };

  const handleSendOTP = async () => {
    if (!data.email) {
      alert("Please enter an Email!");
      return;
    }

    const emailSuccess = await sendEmailOTP();
    if (emailSuccess) {
      setIsOtpSent(true);
    }
  };

  const handleVerifyOTP = () => {
    if (enteredOtpEmail === otpEmail) {
      setIsVerified(true);
      alert("Email OTP verified successfully!");
    } else {
      alert("Invalid OTP! Please try again.");
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
      !data.experienceYears ||
      !image
    ) {
      alert("All fields are required, including the image!");
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

    if (!isVerified) {
      alert("Please verify your Email OTP first!");
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      formData.append("image", image);

      const response = await axios.post(
        "http://localhost:3031/clinic-signup",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

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
          image: "",
        });
        setImage(null);
        setIsOtpSent(false);
        setIsVerified(false);
        setEnteredOtpEmail("");
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
          Clinic Registration
        </h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
          }}
        >
          {[
            "clinicName",
            "email",
            "password",
            "phone",
            "address",
            "licenseNumber",
            "experienceYears",
          ].map((field) => (
            <div
              key={field}
              style={{ gridColumn: field === "address" ? "span 2" : "auto" }}
            >
              <label style={{ fontWeight: "500", marginBottom: "5px" }}>
                {field.replace(/([A-Z])/g, " $1").trim()}:
              </label>
              <input
                type={field === "password" ? "password" : "text"}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ced4da",
                }}
                name={field}
                value={data[field]}
                onChange={inputHandler}
                required
              />
            </div>
          ))}
          <div>
            <label style={{ fontWeight: "500", marginBottom: "5px" }}>
              State:
            </label>
            <select
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
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
            <label style={{ fontWeight: "500", marginBottom: "5px" }}>
              City:
            </label>
            <select
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
              }}
              name="city"
              value={data.city}
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
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontWeight: "500", marginBottom: "5px" }}>
              Description:
            </label>
            <textarea
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
              }}
              name="description"
              value={data.description}
              onChange={inputHandler}
            ></textarea>
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontWeight: "500", marginBottom: "5px" }}>
              Clinic Image:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={imageHandler}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
              }}
            />
          </div>
        </div>

        {/* OTP Section */}
        {!isOtpSent ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              style={{
                backgroundColor: "#28a745",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onClick={handleSendOTP}
            >
              Send OTP
            </button>
          </div>
        ) : (
          <div style={{ marginTop: "20px" }}>
            <div>
              <label style={{ fontWeight: "500", marginBottom: "5px" }}>
                Email OTP:
              </label>
              <input
                type="text"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ced4da",
                }}
                value={enteredOtpEmail}
                onChange={(e) => setEnteredOtpEmail(e.target.value)}
                placeholder="Enter Email OTP"
              />
            </div>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                style={{
                  backgroundColor: "#17a2b8",
                  color: "#ffffff",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                onClick={handleVerifyOTP}
              >
                Verify OTP
              </button>
            </div>
          </div>
        )}

        {/* Register Button */}
        {isVerified && (
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
        )}
      </div>
    </div>
  );
};

export default ClinicReg;