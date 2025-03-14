import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetails = () => {
    const [product, setProduct] = useState(null);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [showCompanyDetails, setShowCompanyDetails] = useState(false);
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const BASE_URL = "http://localhost:3031";
    const userId = sessionStorage.getItem("userId");
    const userName = sessionStorage.getItem("userName") || "Guest";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await axios.get(`${BASE_URL}/product/${id}`);
                if (productResponse.data.status === "success") {
                    setProduct(productResponse.data.data);
                    console.log("Product Data:", productResponse.data.data);

                    const companyId = productResponse.data.data.companyId._id;
                    const companyResponse = await axios.get(`${BASE_URL}/company/${companyId}`);
                    if (companyResponse.data.status === "success") {
                        setCompany(companyResponse.data.data);
                        console.log("Company Data:", companyResponse.data.data);
                    } else {
                        console.error("Error fetching company:", companyResponse.data.message);
                        setCompany(null);
                    }
                } else {
                    console.error("Error fetching product:", productResponse.data.message);
                    setProduct(null);
                }
            } catch (error) {
                console.error("API Error:", error);
                setProduct(null);
                setCompany(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleBuyNow = () => {
        if (!userId) {
            alert("Please log in to proceed with the purchase.");
            navigate("/signin");
            return;
        }
        setShowPaymentOptions(prev => !prev);
        setSelectedPaymentMethod(null);
    };

    const handlePaymentMethodSelect = (method) => {
        setSelectedPaymentMethod(method);
    };

    const handleConfirmBuy = async (paymentType) => {
        if (!product || !company || !userId) return;

        const purchaseData = {
            productId: product._id,
            companyId: company._id,
            userId: userId,
            companyName: company.companyName,
            productName: product.productName,
            userName: userName,
            paymentType: paymentType,
            paymentRate: product.price,
        };

        console.log("Purchase Data Sent:", purchaseData);

        try {
            const response = await axios.post(`${BASE_URL}/purchase`, purchaseData, {
                headers: { "Content-Type": "application/json" },
            });
            if (response.data.status === "success") {
                console.log("Purchase saved:", response.data.data);
                alert(`Purchase confirmed with ${paymentType}!`);
                setShowPaymentOptions(false);
                navigate("/purchased-products");
            } else {
                console.error("Error saving purchase:", response.data.message);
                alert("Failed to confirm purchase.");
            }
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            alert("Error confirming purchase.");
        }
    };

    const handleLike = () => {
        setIsLiked(prev => !prev);
    };

    const handleNextImage = () => {
        if (product && product.images.length > 1) {
            setCurrentImageIndex(prev => (prev + 1) % product.images.length);
        }
    };

    const handlePrevImage = () => {
        if (product && product.images.length > 1) {
            setCurrentImageIndex(prev => (prev - 1 + product.images.length) % product.images.length);
        }
    };

    const toggleFullScreen = () => {
        setIsFullScreen(prev => !prev);
    };

    const toggleCompanyDetails = () => {
        setShowCompanyDetails(prev => !prev);
    };

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    if (loading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "linear-gradient(135deg, #ecf0f1 0%, #dfe4ea 100%)"
            }}>
                <p style={{ fontSize: "1.5rem", color: "#2c3e50", fontWeight: "600" }}>Loading...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "linear-gradient(135deg, #ecf0f1 0%, #dfe4ea 100%)"
            }}>
                <p style={{ fontSize: "1.5rem", color: "#2c3e50", fontWeight: "600" }}>Product not found.</p>
            </div>
        );
    }

    const currentImage = product.images[currentImageIndex];

    return (
        <div style={{
            background: 'linear-gradient(135deg, #ecf0f1 0%, #dfe4ea 100%)',
            minHeight: '100vh',
            padding: '40px 20px',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <div style={{
                maxWidth: '1300px',
                width: '100%',
                position: 'relative'
            }}>
                {/* Back Button */}
                <button
                    onClick={handleBack}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        padding: '12px 20px',
                        background: '#2c3e50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.3s ease, transform 0.2s, box-shadow 0.3s ease',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                        zIndex: 10
                    }}
                    onMouseEnter={(e) => { e.target.style.background = '#34495e'; e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.25)'; }}
                    onMouseLeave={(e) => { e.target.style.background = '#2c3e50'; e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)'; }}
                >
                    ← Back
                </button>

                {/* Image Section */}
                <div style={{
                    marginTop: '60px',
                    marginBottom: '40px',
                    background: '#fff',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                    border: '2px solid #2c3e50'
                }}>
                    <div style={{
                        width: '100%',
                        maxHeight: isFullScreen ? '100vh' : '550px',
                        overflow: 'hidden',
                        position: isFullScreen ? 'fixed' : 'relative',
                        top: isFullScreen ? '0' : 'auto',
                        left: isFullScreen ? '0' : 'auto',
                        zIndex: isFullScreen ? 2000 : 'auto',
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                        <img
                            src={currentImage}
                            alt={`${product.productName} ${currentImageIndex + 1}`}
                            style={{
                                width: '100%',
                                height: isFullScreen ? '100vh' : '550px',
                                objectFit: 'contain',
                                borderRadius: isFullScreen ? '0' : '18px',
                                transition: 'transform 0.4s ease',
                                cursor: 'zoom-in',
                                border: '1px solid #34495e'
                            }}
                            onClick={(e) => e.currentTarget.style.transform = e.currentTarget.style.transform === 'scale(1.5)' ? 'scale(1)' : 'scale(1.5)'}
                            onError={(e) => {
                                e.target.src = "https://via.placeholder.com/550";
                                console.error("Failed to load image:", currentImage);
                            }}
                        />
                        {product.images.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevImage}
                                    style={{
                                        position: 'absolute',
                                        left: '20px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: '#2c3e50',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '50px',
                                        height: '50px',
                                        cursor: 'pointer',
                                        fontSize: '1.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                                        transition: 'transform 0.3s ease, background 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => { e.target.style.transform = 'translateY(-50%) scale(1.1)'; e.target.style.background = '#34495e'; }}
                                    onMouseLeave={(e) => { e.target.style.transform = 'translateY(-50%) scale(1)'; e.target.style.background = '#2c3e50'; }}
                                >
                                    ‹
                                </button>
                                <button
                                    onClick={handleNextImage}
                                    style={{
                                        position: 'absolute',
                                        right: '20px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: '#2c3e50',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '50px',
                                        height: '50px',
                                        cursor: 'pointer',
                                        fontSize: '1.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                                        transition: 'transform 0.3s ease, background 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => { e.target.style.transform = 'translateY(-50%) scale(1.1)'; e.target.style.background = '#34495e'; }}
                                    onMouseLeave={(e) => { e.target.style.transform = 'translateY(-50%) scale(1)'; e.target.style.background = '#2c3e50'; }}
                                >
                                    ›
                                </button>
                            </>
                        )}
                        <button
                            onClick={toggleFullScreen}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: '#2c3e50',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                                transition: 'transform 0.3s ease, background 0.3s ease'
                            }}
                            onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.background = '#34495e'; }}
                            onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.background = '#2c3e50'; }}
                        >
                            {isFullScreen ? "Exit Full Screen" : "Full Screen"}
                        </button>
                    </div>
                    {product.images.length > 1 && (
                        <div style={{
                            display: 'flex',
                            gap: '15px',
                            marginTop: '20px',
                            justifyContent: 'center',
                            padding: '10px'
                        }}>
                            {product.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`${product.productName} ${index + 1}`}
                                    style={{
                                        width: '90px',
                                        height: '90px',
                                        objectFit: 'cover',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        border: currentImageIndex === index ? '4px solid #3498db' : '2px solid #34495e',
                                        transition: 'border 0.3s ease, transform 0.3s ease',
                                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                                    }}
                                    onClick={() => setCurrentImageIndex(index)}
                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/90";
                                        console.error("Failed to load thumbnail:", image);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details Section */}
                <div style={{
                    background: '#fff',
                    padding: '40px',
                    borderRadius: '20px',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                    border: '2px solid #2c3e50'
                }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        color: '#2c3e50',
                        marginBottom: '20px',
                        letterSpacing: '-0.5px',
                        textTransform: 'uppercase'
                    }}>
                        {product.productName}
                    </h1>
                    <p style={{ fontSize: '1.3rem', color: '#388e3c', marginBottom: '15px', fontWeight: '600' }}>
                        <strong>Brand:</strong> {product.brand}
                    </p>
                    <p style={{ fontSize: '1.2rem', color: '#34495e', marginBottom: '15px', fontWeight: '500' }}>
                        <strong>Type:</strong> {product.productType}
                    </p>
                    <p style={{ fontSize: '1.1rem', color: '#34495e', marginBottom: '20px', lineHeight: '1.8' }}>
                        <strong>Description:</strong> {product.description}
                    </p>
                    <p style={{ fontSize: '1.8rem', fontWeight: '700', color: '#2c3e50', marginBottom: '20px' }}>
                        <strong>Price:</strong> ₹{product.price.toFixed(2)}
                    </p>
                    <p style={{ fontSize: '1.2rem', color: product.quantityInStock > 0 ? '#388e3c' : '#d32f2f', marginBottom: '25px', fontWeight: '600' }}>
                        <strong>Stock:</strong> {product.quantityInStock > 0 ? `${product.quantityInStock} in stock` : "Out of Stock"}
                    </p>
                    {product.expiryDate && (
                        <p style={{ fontSize: '1.1rem', color: '#34495e', marginBottom: '25px', fontStyle: 'italic' }}>
                            <strong>Expiry Date:</strong> {new Date(product.expiryDate).toLocaleDateString()}
                        </p>
                    )}
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px' }}>
                        <button
                            style={{
                                background: '#ff9f00',
                                color: '#fff',
                                padding: '14px 35px',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1.2rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                                transition: 'transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease'
                            }}
                            onClick={handleBuyNow}
                            onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.background = '#fb641b'; e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)'; }}
                            onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.background = '#ff9f00'; e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'; }}
                        >
                            Buy Now
                        </button>
                        <button
                            onClick={handleLike}
                            style={{
                                background: isLiked ? '#ff4444' : '#fff',
                                color: isLiked ? '#fff' : '#ff4444',
                                padding: '12px 25px',
                                border: '2px solid #ff4444',
                                borderRadius: '12px',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)'}
                            onMouseLeave={(e) => e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)'}
                        >
                            {isLiked ? "Liked" : "Like"}
                        </button>
                    </div>
                    {showPaymentOptions && (
                        <div style={{
                            marginTop: '30px',
                            padding: '30px',
                            background: '#f9fbfc',
                            borderRadius: '15px',
                            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #34495e'
                        }}>
                            {!selectedPaymentMethod ? (
                                <div style={{ display: 'flex', gap: '25px', justifyContent: 'center' }}>
                                    <button
                                        style={{
                                            background: '#2c3e50',
                                            color: '#fff',
                                            padding: '14px 35px',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                                            transition: 'transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease'
                                        }}
                                        onClick={() => handlePaymentMethodSelect("Pay on Delivery")}
                                        onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.background = '#34495e'; e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)'; }}
                                        onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.background = '#2c3e50'; e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'; }}
                                    >
                                        Pay on Delivery
                                    </button>
                                    <button
                                        style={{
                                            background: '#2c3e50',
                                            color: '#fff',
                                            padding: '14px 35px',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                                            transition: 'transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease'
                                        }}
                                        onClick={() => handlePaymentMethodSelect("QR Scan")}
                                        onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.background = '#34495e'; e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)'; }}
                                        onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.background = '#2c3e50'; e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'; }}
                                    >
                                        QR Scan
                                    </button>
                                </div>
                            ) : selectedPaymentMethod === "Pay on Delivery" ? (
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '1.2rem', color: '#388e3c', marginBottom: '20px', fontWeight: '500' }}>
                                        You’ve selected <strong>Pay on Delivery</strong>. Confirm to proceed.
                                    </p>
                                    <button
                                        style={{
                                            background: '#2c3e50',
                                            color: '#fff',
                                            padding: '14px 35px',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                                            transition: 'transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease'
                                        }}
                                        onClick={() => handleConfirmBuy("Pay on Delivery")}
                                        onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.background = '#34495e'; e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)'; }}
                                        onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.background = '#2c3e50'; e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'; }}
                                    >
                                        Confirm Buy
                                    </button>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center' }}>
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`Payment for ${product.productName} - ₹${product.price}`)}`}
                                        alt="QR Code for Payment"
                                        style={{
                                            width: '200px',
                                            height: '200px',
                                            borderRadius: '12px',
                                            marginBottom: '20px',
                                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                                            border: '1px solid #34495e'
                                        }}
                                    />
                                    <p style={{ fontSize: '1.2rem', color: '#388e3c', marginBottom: '20px', fontWeight: '500' }}>
                                        Scan to Pay ₹{product.price.toFixed(2)} with <strong>QR Scan</strong>
                                    </p>
                                    <button
                                        style={{
                                            background: '#2c3e50',
                                            color: '#fff',
                                            padding: '14px 35px',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                                            transition: 'transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease'
                                        }}
                                        onClick={() => handleConfirmBuy("QR Scan")}
                                        onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.background = '#34495e'; e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)'; }}
                                        onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.background = '#2c3e50'; e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'; }}
                                    >
                                        Confirm Buy
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    <button
                        onClick={toggleCompanyDetails}
                        style={{
                            background: '#2c3e50',
                            color: '#fff',
                            padding: '14px 35px',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                            transition: 'transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease',
                            marginTop: '30px'
                        }}
                        onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.background = '#34495e'; e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)'; }}
                        onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.background = '#2c3e50'; e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'; }}
                    >
                        {showCompanyDetails ? "Hide Company Details" : "View Company Details"}
                    </button>
                    {showCompanyDetails && company && (
                        <div style={{
                            padding: '30px',
                            marginTop: '30px',
                            background: '#f9fbfc',
                            borderRadius: '15px',
                            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #34495e'
                        }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#2c3e50', marginBottom: '20px', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
                                {company.companyName}
                            </h2>
                            <img
                                src={company.brandLogo}
                                alt={`${company.companyName} Logo`}
                                style={{
                                    width: '100%',
                                    maxWidth: '400px',
                                    height: 'auto',
                                    objectFit: 'contain',
                                    borderRadius: '12px',
                                    marginBottom: '20px',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid #34495e'
                                }}
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/400";
                                    console.error("Failed to load logo:", company.brandLogo);
                                }}
                            />
                            <p style={{ fontSize: '1.2rem', color: '#388e3c', marginBottom: '15px', fontWeight: '500' }}>
                                <strong>Email:</strong> {company.email}
                            </p>
                            <p style={{ fontSize: '1.1rem', color: '#34495e', marginBottom: '15px' }}>
                                <strong>Phone:</strong> {company.phone}
                            </p>
                            <p style={{ fontSize: '1.1rem', color: '#34495e', marginBottom: '15px' }}>
                                <strong>Address:</strong> {company.address}, {company.city}, {company.state}, {company.zipCode}
                            </p>
                            <p style={{ fontSize: '1.1rem', color: '#34495e', marginBottom: '15px' }}>
                                <strong>Registration Number:</strong> {company.registrationNumber}
                            </p>
                            {company.aboutCompany && (
                                <p style={{ fontSize: '1.1rem', color: '#34495e', marginBottom: '15px', lineHeight: '1.8' }}>
                                    <strong>About:</strong> {company.aboutCompany}
                                </p>
                            )}
                            <p style={{ fontSize: '1.1rem', color: '#34495e', marginBottom: '15px' }}>
                                <strong>Established Year:</strong> {company.establishedYear}
                            </p>
                            <p style={{ fontSize: '1.1rem', color: '#34495e', marginBottom: '15px' }}>
                                <strong>Company Type:</strong> {company.companyType}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;