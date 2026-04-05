import { useState, useEffect } from "react";
import Navbar from "../components/Header/Navbar.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import VideoCard from "../components/VideoCard/VideoCard.jsx";
import axiosInstance from "../utils/axios.js";

function LikedVideos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLikedVideos();
    }, []);

    const fetchLikedVideos = async () => {
        try {
            const response = await axiosInstance.get("/likes/videos");
            const likedVideos = response.data.data.map(item => item.videoDetails);
            setVideos(likedVideos);
        } catch (error) {
            console.error("Failed to fetch liked videos:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div style={{ display: "flex", paddingTop: 56 }}>
                {/* Sidebar */}
                <div style={{
                    position: "fixed",
                    left: 0,
                    top: 56,
                    width: 224,
                    height: "100%",
                    backgroundColor: "white",
                    borderRight: "1px solid #e5e7eb",
                    zIndex: 40
                }}>
                    <Sidebar />
                </div>

                {/* Main Content */}
                <main style={{ marginLeft: 224, padding: 24, flex: 1 }}>
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">
                        👍 Liked Videos
                    </h1>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                        </div>
                    ) : videos.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-4xl mb-4">👍</p>
                            <p className="text-gray-500 text-lg">No liked videos yet</p>
                            <p className="text-gray-400 text-sm mt-2">
                                Videos you like will appear here
                            </p>
                        </div>
                    ) : (
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

export default LikedVideos;