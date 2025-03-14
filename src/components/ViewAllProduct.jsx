import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewAllProduct = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [expandedImages, setExpandedImages] = useState({});
    const [searchType, setSearchType] = useState("");
    const [sidebarType, setSidebarType] = useState("");
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const navigate = useNavigate();
    const BASE_URL = "http://localhost:3031";

    const productTypes = [
        "Serum", "Shampoo", "Wig", "Conditioner", "Hair Oil",
        "Hair Mask", "Hair Gel", "Hair Spray", "Hair Dye",
        "Scalp Treatment", "Hair Growth Supplement", "Other",
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/viewall-products`);
                if (response.data.status === "success") {
                    setProducts(response.data.data);
                    setFilteredProducts(response.data.data);
                    console.log("Products Data:", response.data.data);
                } else {
                    console.error("Error fetching products:", response.data.message);
                }
            } catch (error) {
                console.error("API Error:", error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const filtered = products.filter(product => {
            const matchesSearchType = searchType ? product.productType === searchType : true;
            const matchesSidebarType = sidebarType ? product.productType === sidebarType : true;
            const matchesPrice = (priceRange.min === "" || product.price >= parseFloat(priceRange.min)) &&
                                (priceRange.max === "" || product.price <= parseFloat(priceRange.max));
            return matchesSearchType && matchesSidebarType && matchesPrice;
        });
        setFilteredProducts(filtered);
    }, [searchType, sidebarType, priceRange, products]);

    const handleAddToCart = (productId) => {
        console.log(`Added product ${productId} to cart`);
        alert("Product added to cart! (Placeholder)");
    };

    const handleViewDetails = (productId) => {
        navigate(`/ProductDetails/${productId}`);
    };

    const toggleImages = (productId) => {
        setExpandedImages(prev => ({
            ...prev,
            [productId]: !prev[productId],
        }));
    };

    const handleSearch = () => {
        // Filtering handled by useEffect
    };

    const handlePriceRangeChange = (e) => {
        const { name, value } = e.target;
        setPriceRange(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, #ecf0f1 0%, #dfe4ea 100%)',
            minHeight: '100vh',
            padding: '40px 20px',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <div style={{
                maxWidth: '1400px',
                width: '100%',
                display: 'flex',
                gap: '30px'
            }}>
                {/* Sidebar */}
                <div style={{
                    width: '280px',
                    padding: '25px',
                    background: '#fff',
                    borderRadius: '15px',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                    border: '2px solid #2c3e50'
                }}>
                    <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#2c3e50',
                        marginBottom: '20px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Filters
                    </h3>
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{
                            fontSize: '1.1rem',
                            color: '#2c3e50',
                            fontWeight: '600',
                            marginBottom: '10px',
                            display: 'block'
                        }}>
                            Product Type
                        </label>
                        <select
                            value={sidebarType}
                            onChange={(e) => setSidebarType(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '10px',
                                border: '1px solid #34495e',
                                fontSize: '1rem',
                                outline: 'none',
                                background: '#f9fbfc',
                                color: '#2c3e50',
                                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                appearance: 'none',
                                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%232c3e50\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 12px center',
                                backgroundSize: '16px'
                            }}
                            onFocus={(e) => { e.target.style.borderColor = '#3498db'; e.target.style.boxShadow = '0 0 8px rgba(52, 152, 219, 0.3)'; }}
                            onBlur={(e) => { e.target.style.borderColor = '#34495e'; e.target.style.boxShadow = 'none'; }}
                        >
                            <option value="">All Types</option>
                            {productTypes.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{
                            fontSize: '1.1rem',
                            color: '#2c3e50',
                            fontWeight: '600',
                            marginBottom: '10px',
                            display: 'block'
                        }}>
                            Price Range (₹)
                        </label>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <input
                                type="number"
                                name="min"
                                value={priceRange.min}
                                onChange={handlePriceRangeChange}
                                placeholder="Min"
                                style={{
                                    width: '50%',
                                    padding: '12px',
                                    borderRadius: '10px',
                                    border: '1px solid #34495e',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    background: '#f9fbfc',
                                    color: '#2c3e50',
                                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                                }}
                                onFocus={(e) => { e.target.style.borderColor = '#3498db'; e.target.style.boxShadow = '0 0 8px rgba(52, 152, 219, 0.3)'; }}
                                onBlur={(e) => { e.target.style.borderColor = '#34495e'; e.target.style.boxShadow = 'none'; }}
                            />
                            <input
                                type="number"
                                name="max"
                                value={priceRange.max}
                                onChange={handlePriceRangeChange}
                                placeholder="Max"
                                style={{
                                    width: '50%',
                                    padding: '12px',
                                    borderRadius: '10px',
                                    border: '1px solid #34495e',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    background: '#f9fbfc',
                                    color: '#2c3e50',
                                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                                }}
                                onFocus={(e) => { e.target.style.borderColor = '#3498db'; e.target.style.boxShadow = '0 0 8px rgba(52, 152, 219, 0.3)'; }}
                                onBlur={(e) => { e.target.style.borderColor = '#34495e'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ flex: '1' }}>
                    {/* Back Button and Search Bar */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '30px'
                    }}>
                        <button
                            onClick={handleBack}
                            style={{
                                padding: '12px 20px',
                                background: '#2c3e50',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background 0.3s ease, transform 0.2s, box-shadow 0.3s ease',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
                            }}
                            onMouseEnter={(e) => { e.target.style.background = '#34495e'; e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.25)'; }}
                            onMouseLeave={(e) => { e.target.style.background = '#2c3e50'; e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)'; }}
                        >
                            ← Back
                        </button>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <select
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                                style={{
                                    padding: '12px',
                                    borderRadius: '10px',
                                    border: '1px solid #34495e',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    background: '#f9fbfc',
                                    color: '#2c3e50',
                                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                    appearance: 'none',
                                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%232c3e50\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 12px center',
                                    backgroundSize: '16px',
                                    width: '200px'
                                }}
                                onFocus={(e) => { e.target.style.borderColor = '#3498db'; e.target.style.boxShadow = '0 0 8px rgba(52, 152, 219, 0.3)'; }}
                                onBlur={(e) => { e.target.style.borderColor = '#34495e'; e.target.style.boxShadow = 'none'; }}
                            >
                                <option value="">All Product Types</option>
                                {productTypes.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>
                            <button
                                onClick={handleSearch}
                                style={{
                                    padding: '12px 20px',
                                    background: '#2c3e50',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background 0.3s ease, transform 0.2s, box-shadow 0.3s ease',
                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
                                }}
                                onMouseEnter={(e) => { e.target.style.background = '#34495e'; e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.25)'; }}
                                onMouseLeave={(e) => { e.target.style.background = '#2c3e50'; e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)'; }}
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '25px'
                    }}>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <div
                                    key={product._id}
                                    style={{
                                        background: '#fff',
                                        borderRadius: '15px',
                                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                                        padding: '20px',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        border: '1px solid #34495e'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-10px)';
                                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.25)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                                    }}
                                >
                                    {/* Image Display */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <img
                                            src={product.images[0]}
                                            alt={`${product.productName} 1`}
                                            style={{
                                                width: '100%',
                                                height: '220px',
                                                objectFit: 'contain',
                                                borderRadius: '10px',
                                                marginBottom: product.images.length > 1 ? '15px' : '0',
                                                border: '1px solid #34495e'
                                            }}
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/220";
                                                console.error("Failed to load image:", product.images[0]);
                                            }}
                                        />
                                        {product.images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={() => toggleImages(product._id)}
                                                    style={{
                                                        background: '#2c3e50',
                                                        color: '#fff',
                                                        padding: '10px',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.9rem',
                                                        width: '100%',
                                                        fontWeight: '600',
                                                        transition: 'background 0.3s ease, transform 0.2s',
                                                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
                                                    }}
                                                    onMouseEnter={(e) => { e.target.style.background = '#34495e'; e.target.style.transform = 'scale(1.02)'; }}
                                                    onMouseLeave={(e) => { e.target.style.background = '#2c3e50'; e.target.style.transform = 'scale(1)'; }}
                                                >
                                                    {expandedImages[product._id] ? "Hide Images" : "Show More Images"}
                                                </button>
                                                {expandedImages[product._id] && (
                                                    <div style={{ maxHeight: '180px', overflowY: 'auto', marginTop: '10px' }}>
                                                        {product.images.slice(1).map((image, index) => (
                                                            <img
                                                                key={index}
                                                                src={image}
                                                                alt={`${product.productName} ${index + 2}`}
                                                                style={{
                                                                    width: '100%',
                                                                    height: 'auto',
                                                                    maxHeight: '120px',
                                                                    objectFit: 'contain',
                                                                    borderRadius: '8px',
                                                                    marginBottom: '10px',
                                                                    border: '1px solid #34495e'
                                                                }}
                                                                onError={(e) => {
                                                                    e.target.src = "https://via.placeholder.com/120";
                                                                    console.error("Failed to load image:", image);
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div style={{ padding: '0 10px' }}>
                                        <h3 style={{
                                            fontSize: '1.3rem',
                                            fontWeight: '700',
                                            color: '#2c3e50',
                                            marginBottom: '8px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {product.productName}
                                        </h3>
                                        <p style={{
                                            fontSize: '1rem',
                                            color: '#388e3c',
                                            marginBottom: '8px',
                                            fontWeight: '500'
                                        }}>
                                            {product.brand}
                                        </p>
                                        <p style={{
                                            fontSize: '0.9rem',
                                            color: '#34495e',
                                            marginBottom: '12px',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {product.description}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                            <span style={{
                                                fontSize: '1.4rem',
                                                fontWeight: '700',
                                                color: '#2c3e50'
                                            }}>
                                                ₹{product.price.toFixed(2)}
                                            </span>
                                            <span style={{
                                                fontSize: '0.9rem',
                                                color: product.quantityInStock > 0 ? '#388e3c' : '#d32f2f',
                                                fontWeight: '500'
                                            }}>
                                                {product.quantityInStock > 0 ? `${product.quantityInStock} in stock` : "Out of Stock"}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <button
                                                style={{
                                                    background: '#ff9f00',
                                                    color: '#fff',
                                                    padding: '12px',
                                                    border: 'none',
                                                    borderRadius: '10px',
                                                    flex: '1',
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.3s ease, transform 0.2s, box-shadow 0.3s ease',
                                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
                                                }}
                                                onClick={() => handleAddToCart(product._id)}
                                                onMouseEnter={(e) => { e.target.style.background = '#fb641b'; e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.25)'; }}
                                                onMouseLeave={(e) => { e.target.style.background = '#ff9f00'; e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)'; }}
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                style={{
                                                    background: '#2c3e50',
                                                    color: '#fff',
                                                    padding: '12px',
                                                    border: 'none',
                                                    borderRadius: '10px',
                                                    flex: '1',
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.3s ease, transform 0.2s, box-shadow 0.3s ease',
                                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
                                                }}
                                                onClick={() => handleViewDetails(product._id)}
                                                onMouseEnter={(e) => { e.target.style.background = '#34495e'; e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.25)'; }}
                                                onMouseLeave={(e) => { e.target.style.background = '#2c3e50'; e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)'; }}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{
                                textAlign: 'center',
                                fontSize: '1.5rem',
                                color: '#34495e',
                                padding: '40px',
                                background: '#fff',
                                borderRadius: '15px',
                                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                                border: '1px solid #34495e'
                            }}>
                                No products available.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewAllProduct;