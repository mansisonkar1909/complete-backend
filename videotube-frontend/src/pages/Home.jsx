import { useState, useEffect } from "react";
import Navbar from "../components/Header/Navbar.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import VideoCard from "../components/VideoCard/VideoCard.jsx";
import axiosInstance from "../utils/axios.js";
import { useSelector } from "react-redux";

function Home() {
    const { theme } = useSelector((state) => state.auth);
    const [sidebarOpen, setSidebarOpen] = useState(true); // ← sidebar state
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("/videos");
            const videosList = response.data?.data?.docs || [];
            setVideos(videosList);
        } catch (error) {
            console.error("Fetch error:", error);
            setError("Failed to fetch videos");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: theme === "dark" ? "#111827" : "#f9fafb" }}>
            <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div style={{ display: "flex", paddingTop: 56 }}>
                <Sidebar isOpen={sidebarOpen} />

                {/* Main Content */}
                <main style={{
                    marginLeft: sidebarOpen ? 224 : 0,
                    padding: 24,
                    flex: 1,
                    transition: "margin-left 0.3s ease"
                }}>
                    {loading && (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 256 }}>
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                        </div>
                    )}

                    {error && (
                        <div style={{ textAlign: "center", color: "#dc2626", marginTop: 32 }}>
                            {error}
                        </div>
                    )}

                    {!loading && !error && videos.length === 0 && (
                        <div style={{ textAlign: "center", marginTop: 64 }}>
                            <p style={{ fontSize: 48, marginBottom: 16 }}>🎬</p>
                            <p style={{ color: "#6b7280", fontSize: 18 }}>No videos yet!</p>
                            <p style={{ color: "#9ca3af", fontSize: 14, marginTop: 8 }}>
                                Upload your first video to get started
                            </p>
                        </div>
                    )}

                    {!loading && videos.length > 0 && (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                            gap: 24
                        }}>
                            {videos.map((video) => (
                                <VideoCard key={video._id} video={video} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Home;