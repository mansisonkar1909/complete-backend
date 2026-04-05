import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Header/Navbar.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import axiosInstance from "../utils/axios.js";

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        fetchVideos();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axiosInstance.get("/dashboard/stats");
            setStats(response.data.data);
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        }
    };

    const fetchVideos = async () => {
        try {
            const response = await axiosInstance.get("/dashboard/videos");
            setVideos(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch videos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePublish = async (videoId, currentStatus) => {
        try {
            await axiosInstance.patch(`/videos/toggle/publish/${videoId}`);
            setVideos(videos.map(v =>
                v._id === videoId ? { ...v, isPublished: !currentStatus } : v
            ));
        } catch (error) {
            console.error("Failed to toggle publish:", error);
        }
    };

    const handleDeleteVideo = async (videoId) => {
        if (!window.confirm("Are you sure you want to delete this video?")) return;
        try {
            await axiosInstance.delete(`/videos/${videoId}`);
            setVideos(videos.filter(v => v._id !== videoId));
        } catch (error) {
            console.error("Failed to delete video:", error);
        }
    };

    const formatCount = (count) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count || 0;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
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

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Dashboard
                        </h1>
                        <Link
                            to="/upload"
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
                        >
                            + Upload Video
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: 16,
                        marginBottom: 32
                    }}>
                        {[
                            { label: "Total Views", value: formatCount(stats?.totalViews), icon: "👁️" },
                            { label: "Total Videos", value: formatCount(stats?.totalVideos), icon: "🎬" },
                            { label: "Subscribers", value: formatCount(stats?.totalSubscribers), icon: "👥" },
                            { label: "Total Likes", value: formatCount(stats?.totalLikes), icon: "👍" }
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                            >
                                <p className="text-3xl mb-2">{stat.icon}</p>
                                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Videos Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Your Videos
                            </h2>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
                            </div>
                        ) : videos.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-4xl mb-4">🎬</p>
                                <p className="text-gray-500">No videos yet</p>
                                <Link
                                    to="/upload"
                                    className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded-xl text-sm"
                                >
                                    Upload your first video
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Video</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Likes</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {videos.map((video) => (
                                            <tr key={video._id} className="hover:bg-gray-50">
                                                {/* Video Info */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={video.thumbnail}
                                                            alt={video.title}
                                                            className="w-20 h-12 rounded-lg object-cover"
                                                        />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800 line-clamp-1">
                                                                {video.title}
                                                            </p>
                                                            <p className="text-xs text-gray-500 line-clamp-1">
                                                                {video.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleTogglePublish(video._id, video.isPublished)}
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                            video.isPublished
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-gray-100 text-gray-600"
                                                        }`}
                                                    >
                                                        {video.isPublished ? "Published" : "Draft"}
                                                    </button>
                                                </td>

                                                {/* Views */}
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {formatCount(video.views)}
                                                </td>

                                                {/* Likes */}
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {formatCount(video.likesCount)}
                                                </td>

                                                {/* Date */}
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {formatDate(video.createdAt)}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            to={`/video/${video._id}`}
                                                            className="text-blue-600 hover:text-blue-700 text-sm"
                                                        >
                                                            View
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteVideo(video._id)}
                                                            className="text-red-600 hover:text-red-700 text-sm"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;