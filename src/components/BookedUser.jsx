import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ComNav from './ComNav';

const BookedUser = () => {
    const navigate = useNavigate();
    const companyId = sessionStorage.getItem('companyId');
    const [purchases, setPurchases] = useState([]);
    const [productStats, setProductStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPurchases = async () => {
            if (!companyId) {
                setError('No company ID found. Redirecting to login...');
                setTimeout(() => navigate('/company-login'), 2000);
                return;
            }

            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`http://localhost:3031/api/purchases/company/${companyId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.status === 'success') {
                    const purchaseData = response.data.data;
                    setPurchases(purchaseData);

                    const stats = purchaseData.reduce((acc, purchase) => {
                        const productName = purchase.productName || 'Unknown Product';
                        acc[productName] = (acc[productName] || 0) + 1;
                        return acc;
                    }, {});
                    setProductStats(stats);
                } else {
                    setError(response.data.message || 'Failed to fetch purchase data');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred while fetching purchases');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, [companyId, navigate]);

    const mostPurchasedProduct = Object.entries(productStats).reduce(
        (max, [product, count]) => (count > max.count ? { product, count } : max),
        { product: 'None', count: 0 }
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
            {/* Sidebar Navigation */}
            <ComNav />

            {/* Main Content */}
            <div
                style={{
                    marginLeft: '250px',
                    flexGrow: 1,
                    padding: '40px',
                    backgroundColor: '#f1f5f9',
                    fontFamily: "'Poppins', sans-serif",
                }}
            >
                <div
                    style={{
                        backgroundColor: '#1e2a44', // Dark blue theme
                        padding: '30px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                        color: '#fff',
                    }}
                >
                    <h2
                        style={{
                            textAlign: 'center',
                            fontSize: '2rem',
                            fontWeight: '700',
                            marginBottom: '30px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                        }}
                    >
                        Purchased Products
                    </h2>

                    {loading && (
                        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#3498db' }}>
                            Loading...
                        </p>
                    )}
                    {error && (
                        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#e74c3c', marginBottom: '20px' }}>
                            {error}
                        </p>
                    )}

                    {!loading && !error && (
                        <>
                            {/* Purchase List */}
                            <div style={{ marginBottom: '40px' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Purchase Details</h3>
                                {purchases.length === 0 ? (
                                    <p style={{ fontSize: '1.1rem' }}>No purchases found for this company.</p>
                                ) : (
                                    <table
                                        style={{
                                            width: '100%',
                                            borderCollapse: 'collapse',
                                            backgroundColor: '#2c3e50', // Slightly lighter dark blue
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                                        }}
                                    >
                                        <thead>
                                            <tr style={{ backgroundColor: '#3498db', color: '#fff' }}>
                                                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Product Name</th>
                                                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>User Name</th>
                                                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Payment Type</th>
                                                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Payment Rate</th>
                                                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Purchase Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {purchases.map((purchase, index) => (
                                                <tr
                                                    key={purchase._id}
                                                    style={{
                                                        backgroundColor: index % 2 === 0 ? '#2c3e50' : '#34495e',
                                                        transition: 'background-color 0.3s ease',
                                                    }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3e5c76')}
                                                    onMouseLeave={(e) =>
                                                        (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#2c3e50' : '#34495e')
                                                    }
                                                >
                                                    <td style={{ padding: '15px' }}>{purchase.productName || 'Unknown Product'}</td>
                                                    <td style={{ padding: '15px' }}>{purchase.userName || 'Unknown User'}</td>
                                                    <td style={{ padding: '15px' }}>{purchase.paymentType}</td>
                                                    <td style={{ padding: '15px' }}>{purchase.paymentRate}</td>
                                                    <td style={{ padding: '15px' }}>
                                                        {new Date(purchase.purchaseDate).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {/* Statistical Arrangement */}
                            <div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Product Purchase Statistics</h3>
                                {Object.keys(productStats).length === 0 ? (
                                    <p style={{ fontSize: '1.1rem' }}>No statistics available.</p>
                                ) : (
                                    <>
                                        <ul style={{ listStyle: 'none', padding: 0 }}>
                                            {Object.entries(productStats).map(([product, count]) => (
                                                <li
                                                    key={product}
                                                    style={{
                                                        padding: '15px',
                                                        backgroundColor: '#2c3e50',
                                                        marginBottom: '10px',
                                                        borderRadius: '8px',
                                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                                        transition: 'transform 0.3s ease, background-color 0.3s ease',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.transform = 'scale(1.02)';
                                                        e.target.style.backgroundColor = '#3498db';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.transform = 'scale(1)';
                                                        e.target.style.backgroundColor = '#2c3e50';
                                                    }}
                                                >
                                                    {product}: {count} purchase{count > 1 ? 's' : ''}
                                                </li>
                                            ))}
                                        </ul>
                                        <p
                                            style={{
                                                marginTop: '20px',
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold',
                                                color: '#3498db',
                                            }}
                                        >
                                            Most Purchased Product: {mostPurchasedProduct.product} ({mostPurchasedProduct.count} purchases)
                                        </p>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookedUser;