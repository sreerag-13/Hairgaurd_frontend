import React from "react";
import { Link, useNavigate } from "react-router-dom";

const ComNav = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log("Logout clicked, navigating to /CompanyLog");
        sessionStorage.clear();
        navigate("/CompanyLog");
    };

    const navItems = [
        { label: "Home", path: "/ComDash", icon: "🏠" },
        { label: "Profile", path: "/CompanyProfile", icon: "👤" },
        { label: "Add Product", path: "/AddProduct", icon: "➕" },
        { label: "Purchased Products", path: "/BookedUser", icon: "🛒" },
        { label: "Logout", path: null, icon: "🚪", action: handleLogout },
    ];

    return (
        <nav
            style={{
                backgroundColor: "#1e2a44",
                width: "250px",
                height: "100vh",
                position: "fixed",
                top: 0,
                left: 0,
                boxShadow: "4px 0 15px rgba(0, 0, 0, 0.3)",
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
                padding: "20px 0",
                borderRight: "2px solid #2c3e50",
                transition: "width 0.3s ease",
                fontFamily: "'Poppins', sans-serif",
            }}
        >
            <div
                style={{
                    padding: "20px",
                    textAlign: "center",
                    borderBottom: "1px solid #2c3e50",
                    cursor: "pointer",
                }}
                onClick={() => navigate("/ComDash")}
            >
                <h1
                    style={{
                        color: "#fff",
                        fontSize: "1.6rem",
                        fontWeight: "700",
                        margin: 0,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        transition: "color 0.3s ease, transform 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.color = "#3498db";
                        e.target.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.color = "#fff";
                        e.target.style.transform = "scale(1)";
                    }}
                >
                    Company
                </h1>
            </div>

            <ul
                style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    paddingTop: "20px",
                }}
            >
                {navItems.map((item, index) => (
                    <li
                        key={index}
                        style={{
                            position: "relative",
                            transition: "background-color 0.3s ease, padding-left 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#2c3e50";
                            e.currentTarget.style.paddingLeft = "15px";
                            const underline = e.currentTarget.querySelector("span:last-child");
                            if (underline) underline.style.width = "50%";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.paddingLeft = "10px";
                            const underline = e.currentTarget.querySelector("span:last-child");
                            if (underline) underline.style.width = "0";
                        }}
                    >
                        {item.label === "Logout" ? (
                            <div
                                style={{
                                    color: "#fff",
                                    fontSize: "1.1rem",
                                    fontWeight: "500",
                                    textDecoration: "none",
                                    padding: "15px 20px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "15px",
                                    transition: "color 0.3s ease",
                                }}
                                onClick={handleLogout}
                                onMouseEnter={(e) => (e.target.style.color = "#e74c3c")}
                                onMouseLeave={(e) => (e.target.style.color = "#fff")}
                            >
                                <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                                <span
                                    style={{
                                        position: "absolute",
                                        bottom: "5px",
                                        left: "50px",
                                        width: "0",
                                        height: "2px",
                                        backgroundColor: "#e74c3c",
                                        transition: "width 0.3s ease",
                                    }}
                                ></span>
                            </div>
                        ) : (
                            <Link
                                to={item.path}
                                style={{
                                    color: "#fff",
                                    fontSize: "1.1rem",
                                    fontWeight: "500",
                                    textDecoration: "none",
                                    padding: "15px 20px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "15px",
                                    transition: "color 0.3s ease",
                                }}
                                onClick={() => navigate(item.path)}
                                onMouseEnter={(e) => (e.target.style.color = "#3498db")}
                                onMouseLeave={(e) => (e.target.style.color = "#fff")}
                            >
                                <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                                <span
                                    style={{
                                        position: "absolute",
                                        bottom: "5px",
                                        left: "50px",
                                        width: "0",
                                        height: "2px",
                                        backgroundColor: "#3498db",
                                        transition: "width 0.3s ease",
                                    }}
                                ></span>
                            </Link>
                        )}
                    </li>
                ))}
            </ul>

            <style jsx>{`
                @media (max-width: 768px) {
                    nav {
                        width: 80px;
                    }
                    .nav-label {
                        display: none;
                    }
                    h1 {
                        font-size: 1.2rem !important;
                        writing-mode: vertical-rl;
                        transform: rotate(180deg);
                        padding: 10px 0 !important;
                    }
                    ul {
                        padding-top: 10px !important;
                    }
                }
            `}</style>
        </nav>
    );
};

export default ComNav;