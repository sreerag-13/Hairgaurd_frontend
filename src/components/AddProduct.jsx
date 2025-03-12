import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ComNav from "./ComNav"; // Import the ComNav component

const AddProduct = () => {
    const navigate = useNavigate();
    const companyId = sessionStorage.getItem("companyId");
    const [formData, setFormData] = useState({
        productName: "",
        brand: "",
        productType: "",
        description: "",
        price: "",
        quantityInStock: "",
        expiryDate: "",
    });
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [products, setProducts] = useState([]);
    const [editProductId, setEditProductId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const productTypes = [
        "Serum", "Shampoo", "Wig", "Conditioner", "Hair Oil",
        "Hair Mask", "Hair Gel", "Hair Spray", "Hair Dye",
        "Scalp Treatment", "Hair Growth Supplement", "Other",
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            if (!companyId) {
                setError("No company ID found. Redirecting to login...");
                setTimeout(() => navigate("/company-login"), 2000);
                return;
            }

            try {
                setLoading(true);
                const token = sessionStorage.getItem("token");
                const response = await axios.get(`http://localhost:3031/api/products/company/${companyId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.status === "success") {
                    setProducts(response.data.data);
                } else {
                    setError(response.data.message || "Failed to fetch products");
                }
            } catch (err) {
                setError(err.response?.data?.message || "Error fetching products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [companyId, navigate]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const totalImages = images.length + newFiles.length;

        if (totalImages > 3) {
            alert("You can upload a maximum of 3 images.");
            return;
        }

        setImages((prevImages) => [...prevImages, ...newFiles]);
        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
        setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!companyId) {
            alert("Company ID is missing. Please log in again.");
            return;
        }

        if (
            !editProductId &&
            (!formData.productName || !formData.brand || !formData.productType || !formData.description || !formData.price || !formData.quantityInStock || images.length === 0)
        ) {
            alert("All fields are required, including at least one image, for adding a product!");
            return;
        }

        const form = new FormData();
        form.append("companyId", companyId);
        Object.keys(formData).forEach((key) => {
            if (formData[key]) form.append(key, formData[key]);
        });
        images.forEach((image) => form.append("images", image));

        try {
            setLoading(true);
            const token = sessionStorage.getItem("token");
            const url = editProductId ? `http://localhost:3031/api/products/${editProductId}` : "http://localhost:3031/add-product";
            const method = editProductId ? axios.put : axios.post;

            const response = await method(url, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status === "success") {
                alert(editProductId ? "Product updated successfully!" : "Product added successfully!");
                setFormData({
                    productName: "",
                    brand: "",
                    productType: "",
                    description: "",
                    price: "",
                    quantityInStock: "",
                    expiryDate: "",
                });
                setImages([]);
                setImagePreviews([]);
                setEditProductId(null);

                const updatedProducts = await axios.get(`http://localhost:3031/api/products/company/${companyId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProducts(updatedProducts.data.data);
            } else {
                alert("Error: " + response.data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Server error: " + (error.response?.data?.message || "Please try again later."));
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            productName: product.productName,
            brand: product.brand,
            productType: product.productType,
            description: product.description,
            price: product.price,
            quantityInStock: product.quantityInStock,
            expiryDate: product.expiryDate ? product.expiryDate.split("T")[0] : "",
        });
        setEditProductId(product._id);
        setImagePreviews(product.images);
        setImages([]);
    };

    const handleDelete = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            setLoading(true);
            const token = sessionStorage.getItem("token");
            const response = await axios.delete(`http://localhost:3031/api/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.status === "success") {
                alert("Product deleted successfully!");
                setProducts(products.filter((product) => product._id !== productId));
            } else {
                alert("Error: " + response.data.message);
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Server error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f1f5f9" }}>
            {/* Sidebar Navigation */}
            <ComNav />

            {/* Main Content */}
            <div
                style={{
                    marginLeft: "250px", // Matches the fixed width of ComNav
                    flexGrow: 1,
                    padding: "40px",
                    backgroundColor: "#f1f5f9",
                    minWidth: 0, // Prevents overflow
                }}
            >
                {/* Form Section */}
                <div
                    style={{
                        backgroundColor: "#1e2a44",
                        padding: "30px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                        marginBottom: "40px",
                    }}
                >
                    <h2
                        style={{
                            textAlign: "center",
                            color: "#fff",
                            fontSize: "2rem",
                            fontWeight: "700",
                            marginBottom: "30px",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                        }}
                    >
                        {editProductId ? "Edit Product" : "Add Product"}
                    </h2>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <label style={{ display: "block", marginBottom: "8px", color: "#d1d5db", fontSize: "1.1rem", fontWeight: "500" }}>
                            Product Name:
                        </label>
                        <input
                            type="text"
                            name="productName"
                            value={formData.productName}
                            onChange={handleInputChange}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginBottom: "20px",
                                borderRadius: "8px",
                                border: "1px solid #2c3e50",
                                backgroundColor: "#2c3e50",
                                color: "#fff",
                                fontSize: "1rem",
                            }}
                        />

                        <label style={{ display: "block", marginBottom: "8px", color: "#d1d5db", fontSize: "1.1rem", fontWeight: "500" }}>
                            Brand:
                        </label>
                        <input
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleInputChange}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginBottom: "20px",
                                borderRadius: "8px",
                                border: "1px solid #2c3e50",
                                backgroundColor: "#2c3e50",
                                color: "#fff",
                                fontSize: "1rem",
                            }}
                        />

                        <label style={{ display: "block", marginBottom: "8px", color: "#d1d5db", fontSize: "1.1rem", fontWeight: "500" }}>
                            Product Type:
                        </label>
                        <select
                            name="productType"
                            value={formData.productType}
                            onChange={handleInputChange}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginBottom: "20px",
                                borderRadius: "8px",
                                border: "1px solid #2c3e50",
                                backgroundColor: "#2c3e50",
                                color: "#fff",
                                fontSize: "1rem",
                            }}
                        >
                            <option value="" style={{ color: "#d1d5db" }}>Select Product Type</option>
                            {productTypes.map((type, index) => (
                                <option key={index} value={type} style={{ color: "#fff" }}>
                                    {type}
                                </option>
                            ))}
                        </select>

                        <label style={{ display: "block", marginBottom: "8px", color: "#d1d5db", fontSize: "1.1rem", fontWeight: "500" }}>
                            Description:
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginBottom: "20px",
                                borderRadius: "8px",
                                border: "1px solid #2c3e50",
                                backgroundColor: "#2c3e50",
                                color: "#fff",
                                fontSize: "1rem",
                                minHeight: "120px",
                            }}
                        ></textarea>

                        <label style={{ display: "block", marginBottom: "8px", color: "#d1d5db", fontSize: "1.1rem", fontWeight: "500" }}>
                            Price (per unit):
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginBottom: "20px",
                                borderRadius: "8px",
                                border: "1px solid #2c3e50",
                                backgroundColor: "#2c3e50",
                                color: "#fff",
                                fontSize: "1rem",
                            }}
                        />

                        <label style={{ display: "block", marginBottom: "8px", color: "#d1d5db", fontSize: "1.1rem", fontWeight: "500" }}>
                            Quantity in Stock:
                        </label>
                        <input
                            type="number"
                            name="quantityInStock"
                            value={formData.quantityInStock}
                            onChange={handleInputChange}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginBottom: "20px",
                                borderRadius: "8px",
                                border: "1px solid #2c3e50",
                                backgroundColor: "#2c3e50",
                                color: "#fff",
                                fontSize: "1rem",
                            }}
                        />

                        <label style={{ display: "block", marginBottom: "8px", color: "#d1d5db", fontSize: "1.1rem", fontWeight: "500" }}>
                            Expiry Date (Optional):
                        </label>
                        <input
                            type="date"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginBottom: "20px",
                                borderRadius: "8px",
                                border: "1px solid #2c3e50",
                                backgroundColor: "#2c3e50",
                                color: "#fff",
                                fontSize: "1rem",
                            }}
                        />

                        <label style={{ display: "block", marginBottom: "8px", color: "#d1d5db", fontSize: "1.1rem", fontWeight: "500" }}>
                            Product Images (Up to 3):
                        </label>
                        <input
                            type="file"
                            name="images"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginBottom: "20px",
                                borderRadius: "8px",
                                border: "1px solid #2c3e50",
                                backgroundColor: "#2c3e50",
                                color: "#fff",
                                fontSize: "1rem",
                            }}
                        />

                        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "20px" }}>
                            {imagePreviews.map((src, index) => (
                                <img
                                    key={index}
                                    src={src}
                                    alt="Preview"
                                    style={{
                                        width: "120px",
                                        height: "120px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        border: "2px solid #3498db",
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "15px",
                                backgroundColor: loading ? "#6b7280" : "#3498db",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "1.2rem",
                                fontWeight: "600",
                                cursor: loading ? "not-allowed" : "pointer",
                            }}
                        >
                            {loading ? "Processing..." : editProductId ? "Update Product" : "Add Product"}
                        </button>
                    </form>
                </div>

                {/* Product List Section */}
                <div
                    style={{
                        backgroundColor: "#fff",
                        padding: "30px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <h2
                        style={{
                            textAlign: "center",
                            color: "#1e2a44",
                            fontSize: "2rem",
                            fontWeight: "700",
                            marginBottom: "30px",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                        }}
                    >
                        Existing Products
                    </h2>
                    {loading && <p style={{ textAlign: "center", color: "#3498db" }}>Loading products...</p>}
                    {error && <p style={{ textAlign: "center", color: "#e74c3c" }}>{error}</p>}
                    {!loading && !error && products.length === 0 && (
                        <p style={{ textAlign: "center", color: "#6b7280" }}>No products found for this company.</p>
                    )}
                    {!loading && !error && products.length > 0 && (
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#1e2a44", color: "#fff" }}>
                                    <th style={{ padding: "15px", textAlign: "left" }}>Name</th>
                                    <th style={{ padding: "15px", textAlign: "left" }}>Brand</th>
                                    <th style={{ padding: "15px", textAlign: "left" }}>Type</th>
                                    <th style={{ padding: "15px", textAlign: "left" }}>Price</th>
                                    <th style={{ padding: "15px", textAlign: "left" }}>Stock</th>
                                    <th style={{ padding: "15px", textAlign: "left" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                                        <td style={{ padding: "15px" }}>{product.productName}</td>
                                        <td style={{ padding: "15px" }}>{product.brand}</td>
                                        <td style={{ padding: "15px" }}>{product.productType}</td>
                                        <td style={{ padding: "15px" }}>{product.price}</td>
                                        <td style={{ padding: "15px" }}>{product.quantityInStock}</td>
                                        <td style={{ padding: "15px" }}>
                                            <button
                                                onClick={() => handleEdit(product)}
                                                style={{
                                                    padding: "8px 15px",
                                                    backgroundColor: "#28a745",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    marginRight: "10px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                style={{
                                                    padding: "8px 15px",
                                                    backgroundColor: "#e74c3c",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddProduct;