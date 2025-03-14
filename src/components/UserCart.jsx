import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserNav from "./UserNav";

const UserCart = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setError("You are not logged in. Please log in to view your purchases.");
      setLoading(false);
      return;
    }

    const fetchPurchases = async () => {
      try {
        console.log("Fetching purchases for userId:", userId);
        const response = await axios.get(`http://localhost:3031/api/purchases/user/${userId}`, {
          headers: { "Content-Type": "application/json" },
        });
        console.log("API Response:", response.data);
        setPurchases(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.response?.data?.message || "Failed to connect to the server. Please try again later.");
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [userId]);

  // Print function for individual bills
  const handlePrint = (purchaseId) => {
    const printContent = document.getElementById(`bill-${purchaseId}`).innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        ${printContent}
      </div>
    `;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Restore the page after printing
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px", fontFamily: "Arial, sans-serif" }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "#e74c3c", fontFamily: "Arial, sans-serif" }}>
        {error}
        <br />
        <button
          onClick={() => navigate("/login")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#e74c3c",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#c0392b")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#e74c3c")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f4f7fa", minHeight: "100vh" }}>
      {/* Navbar */}
      <UserNav />

      {/* Bill List Container */}
      <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px" }}>
        <h2 style={{ color: "#2c3e50", fontSize: "28px", fontWeight: "600", marginBottom: "30px", textAlign: "center" }}>
          Your Purchase History
        </h2>

        {purchases.length === 0 ? (
          <p style={{ textAlign: "center", color: "#7f8c8d", fontSize: "18px" }}>
            No purchases found.
          </p>
        ) : (
          <div style={{ display: "grid", gap: "20px" }}>
            {purchases.map((purchase) => (
              <div
                key={purchase._id}
                id={`bill-${purchase._id}`} // Unique ID for printing
                style={billCardStyle}
              >
                <div style={billHeaderStyle}>
                  <h3 style={{ margin: 0, color: "#2c3e50", fontSize: "22px" }}>
                    Purchase Invoice
                  </h3>
                  <p style={{ margin: "5px 0", color: "#7f8c8d", fontSize: "14px" }}>
                    Generated on: {new Date().toLocaleDateString()}
                  </p>
                </div>

                <div style={billDetailsStyle}>
                  <div style={detailRowStyle}>
                    <span style={labelStyle}>Product Name:</span>
                    <span style={valueStyle}>{purchase.productName}</span>
                  </div>
                  <div style={detailRowStyle}>
                    <span style={labelStyle}>Company:</span>
                    <span style={valueStyle}>{purchase.companyName}</span>
                  </div>
                  <div style={detailRowStyle}>
                    <span style={labelStyle}>Payment Type:</span>
                    <span style={valueStyle}>{purchase.paymentType}</span>
                  </div>
                  <div style={detailRowStyle}>
                    <span style={labelStyle}>Price:</span>
                    <span style={valueStyle}>${purchase.paymentRate}</span>
                  </div>
                  <div style={detailRowStyle}>
                    <span style={labelStyle}>Purchase Date:</span>
                    <span style={valueStyle}>{new Date(purchase.purchaseDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div style={totalStyle}>
                  <span style={{ fontWeight: "bold", color: "#2c3e50" }}>Total:</span>
                  <span style={{ fontWeight: "bold", color: "#e74c3c" }}>${purchase.paymentRate}</span>
                </div>

                <button
                  onClick={() => handlePrint(purchase._id)}
                  style={printButtonStyle}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#1a252f")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#2c3e50")}
                >
                  Print Invoice
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const billCardStyle = {
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  padding: "20px",
  position: "relative",
};

const billHeaderStyle = {
  borderBottom: "2px solid #2c3e50",
  paddingBottom: "10px",
  marginBottom: "15px",
};

const billDetailsStyle = {
  marginTop: "15px",
};

const detailRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid #eee",
};

const labelStyle = {
  fontWeight: "600",
  color: "#2c3e50",
  flex: "1",
};

const valueStyle = {
  color: "#34495e",
  flex: "2",
  textAlign: "right",
};

const totalStyle = {
  display: "flex",
  justifyContent: "flex-end",
  padding: "15px 0",
  borderTop: "2px solid #2c3e50",
  marginTop: "15px",
  gap: "20px",
};

const printButtonStyle = {
  display: "block",
  margin: "20px auto 0",
  padding: "10px 20px",
  backgroundColor: "#2c3e50",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  transition: "background-color 0.3s",
};

export default UserCart;