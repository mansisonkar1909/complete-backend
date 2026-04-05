import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function Sidebar({ isOpen }) {
    const { user, theme } = useSelector((state) => state.auth);
    // ✅ No useState needed here - isOpen comes from parent page

    const menuItems = [
        { icon: "🏠", label: "Home", path: "/" },
        { icon: "🎬", label: "Subscriptions", path: "/subscriptions" },
        { icon: "📜", label: "History", path: "/history" },
        { icon: "👍", label: "Liked Videos", path: "/liked-videos" },
        { icon: "📋", label: "Playlists", path: "/playlists" },
        { icon: "📊", label: "Dashboard", path: "/dashboard" },
        { icon: "⬆️", label: "Upload", path: "/upload" },
    ];

    return (
        <div style={{
            position: "fixed",
            left: 0,
            top: 56,
            width: isOpen ? 224 : 0,
            height: "100%",
            backgroundColor: theme === "dark" ? "#111827" : "white",
            borderRight: isOpen ? `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}` : "none",
            zIndex: 40,
            overflowX: "hidden",
            transition: "width 0.3s ease",
            overflowY: "auto"
        }}>
            <div style={{ padding: "8px", whiteSpace: "nowrap" }}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "12px 16px",
                            borderRadius: 12,
                            textDecoration: "none",
                            fontSize: 14,
                            fontWeight: 500,
                            marginBottom: 4,
                            backgroundColor: isActive
                                ? theme === "dark" ? "#7f1d1d" : "#fef2f2"
                                : "transparent",
                            color: isActive
                                ? "#dc2626"
                                : theme === "dark" ? "#d1d5db" : "#374151"
                        })}
                    >
                        <span style={{ fontSize: 20 }}>{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </div>

            {/* User at bottom */}
            {user && (
                <div style={{
                    position: "absolute",
                    bottom: 80,
                    left: 0,
                    right: 0,
                    padding: "0 8px"
                }}>
                    <NavLink
                        to={`/channel/${user?.username}`}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "12px 16px",
                            borderRadius: 12,
                            textDecoration: "none"
                        }}
                    >
                        <img
                            src={user?.avatar}
                            alt={user?.username}
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                objectFit: "cover",
                                flexShrink: 0
                            }}
                        />
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: theme === "dark" ? "white" : "#1f2937" }}>
                                {user?.fullname}
                            </p>
                            <p style={{ fontSize: 11, color: "#6b7280" }}>
                                @{user?.username}
                            </p>
                        </div>
                    </NavLink>
                </div>
            )}
        </div>
    );
}

export default Sidebar;