import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, toggleTheme } from "../../store/slices/authSlice.js";
import axiosInstance from "../../utils/axios.js";

function Navbar({ onToggleSidebar }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, theme } = useSelector((state) => state.auth);
    const [searchQuery, setSearchQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/users/logout");
            dispatch(logout());
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/?search=${searchQuery}`);
    };

    return (
        <nav style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            backgroundColor: theme === "dark" ? "#111827" : "white",
            borderBottom: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
            padding: "8px 16px"
        }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1280, margin: "0 auto" }}>

                {/* Left - Hamburger + Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Hamburger Menu */}
                    <button
                        onClick={onToggleSidebar}
                        style={{
                            padding: 8,
                            borderRadius: 8,
                            border: "none",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            fontSize: 20
                        }}
                    >
                        ☰
                    </button>

                    {/* Logo */}
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <span style={{ fontSize: 22, fontWeight: "bold", color: "#dc2626" }}>
                            VideoTube
                        </span>
                    </Link>
                </div>

                {/* Center - Search */}
                <form onSubmit={handleSearch} style={{ display: "flex", flex: 1, maxWidth: 500, margin: "0 32px" }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search videos..."
                        style={{
                            flex: 1,
                            padding: "8px 16px",
                            borderRadius: "20px 0 0 20px",
                            border: `1px solid ${theme === "dark" ? "#374151" : "#d1d5db"}`,
                            backgroundColor: theme === "dark" ? "#1f2937" : "#f9fafb",
                            color: theme === "dark" ? "white" : "#1f2937",
                            outline: "none"
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: "8px 16px",
                            borderRadius: "0 20px 20px 0",
                            border: `1px solid ${theme === "dark" ? "#374151" : "#d1d5db"}`,
                            borderLeft: "none",
                            backgroundColor: theme === "dark" ? "#374151" : "#f3f4f6",
                            cursor: "pointer"
                        }}
                    >
                        🔍
                    </button>
                </form>

                {/* Right - Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={() => dispatch(toggleTheme())}
                        style={{
                            padding: 8,
                            borderRadius: "50%",
                            border: "none",
                            backgroundColor: theme === "dark" ? "#374151" : "#f3f4f6",
                            cursor: "pointer",
                            fontSize: 18
                        }}
                    >
                        {theme === "dark" ? "☀️" : "🌙"}
                    </button>

                    {/* Upload Button */}
                    <Link
                        to="/upload"
                        style={{
                            backgroundColor: "#dc2626",
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: 20,
                            textDecoration: "none",
                            fontSize: 14,
                            fontWeight: 600
                        }}
                    >
                        + Upload
                    </Link>

                    {/* Avatar + Dropdown */}
                    <div style={{ position: "relative" }}>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            style={{ border: "none", background: "none", cursor: "pointer" }}
                        >
                            <img
                                src={user?.avatar}
                                alt={user?.username}
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "2px solid #dc2626"
                                }}
                            />
                        </button>

                        {/* Dropdown */}
                        {menuOpen && (
                            <div style={{
                                position: "absolute",
                                right: 0,
                                marginTop: 8,
                                width: 200,
                                backgroundColor: theme === "dark" ? "#1f2937" : "white",
                                borderRadius: 12,
                                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                                border: `1px solid ${theme === "dark" ? "#374151" : "#f3f4f6"}`,
                                zIndex: 100
                            }}>
                                {/* User Info */}
                                <div style={{ padding: "12px 16px", borderBottom: `1px solid ${theme === "dark" ? "#374151" : "#f3f4f6"}` }}>
                                    <p style={{ fontWeight: 600, fontSize: 14, color: theme === "dark" ? "white" : "#1f2937" }}>
                                        {user?.fullname}
                                    </p>
                                    <p style={{ fontSize: 12, color: "#6b7280" }}>
                                        @{user?.username}
                                    </p>
                                </div>

                                {/* Menu Items */}
                                {[
                                    { icon: "👤", label: "Your Channel", path: `/channel/${user?.username}` },
                                    { icon: "📊", label: "Dashboard", path: "/dashboard" },
                                    { icon: "👍", label: "Liked Videos", path: "/liked-videos" },
                                ].map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMenuOpen(false)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            padding: "10px 16px",
                                            textDecoration: "none",
                                            fontSize: 14,
                                            color: theme === "dark" ? "#d1d5db" : "#374151"
                                        }}
                                    >
                                        {item.icon} {item.label}
                                    </Link>
                                ))}

                                <button
                                    onClick={handleLogout}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        padding: "10px 16px",
                                        width: "100%",
                                        border: "none",
                                        backgroundColor: "transparent",
                                        cursor: "pointer",
                                        fontSize: 14,
                                        color: "#dc2626",
                                        textAlign: "left"
                                    }}
                                >
                                    🚪 Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;