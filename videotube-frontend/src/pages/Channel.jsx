import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Header/Navbar.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import VideoCard from "../components/VideoCard/VideoCard.jsx";
import axiosInstance from "../utils/axios.js";

function Channel() {
    const { username } = useParams();
    const { user } = useSelector((state) => state.auth);

    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [activeTab, setActiveTab] = useState("videos");

    useEffect(() => {
        fetchChannel();
        fetchChannelVideos();
    }, [username]);

    const fetchChannel = async () => {
        try {
            const response = await axiosInstance.get(`/users/channel/${username}`);
            const channelData = response.data.data;
            setChannel(channelData);
            setIsSubscribed(channelData.isSubscribed);
        } catch (error) {
            console.error("Failed to fetch channel:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchChannelVideos = async () => {
        try {
            const response = await axiosInstance.get(`/videos?userId=${user?._id}`);
            setVideos(response.data.data?.docs || []);
        } catch (error) {
            console.error("Failed to fetch videos:", error);
        }
    };

    const handleSubscribe = async () => {
        try {
            await axiosInstance.post(`/subscriptions/c/${channel._id}`);
            setIsSubscribed(!isSubscribed);
            setChannel({
                ...channel,
                subscribersCount: isSubscribed
                    ? channel.subscribersCount - 1
                    : channel.subscribersCount + 1
            });
        } catch (error) {
            console.error("Failed to toggle subscription:", error);
        }
    };

    const formatCount = (count) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                </div>
            </div>
        );
    }

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
                <main style={{ marginLeft: 224, flex: 1 }}>

                    {/* Cover Image */}
                    <div className="w-full h-48 bg-gray-200 overflow-hidden">
                        {channel?.coverImage ? (
                            <img
                                src={channel.coverImage}
                                alt="cover"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-r from-red-500 to-red-700" />
                        )}
                    </div>

                    {/* Channel Info */}
                    <div className="px-8 pb-4 border-b border-gray-200 bg-white">
                        <div className="flex items-end justify-between -mt-8">
                            {/* Avatar */}
                            <img
                                src={channel?.avatar}
                                alt={channel?.username}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white"
                            />

                            {/* Subscribe Button */}
                            {user?.username !== username && (
                                <button
                                    onClick={handleSubscribe}
                                    className={`px-6 py-2 rounded-full font-semibold text-sm transition mb-2 ${
                                        isSubscribed
                                            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                            : "bg-red-600 text-white hover:bg-red-700"
                                    }`}
                                >
                                    {isSubscribed ? "Subscribed ✓" : "Subscribe"}
                                </button>
                            )}

                            {/* Edit Profile Button */}
                            {user?.username === username && (
                                <Link
                                    to="/edit-profile"
                                    className="px-6 py-2 rounded-full font-semibold text-sm bg-gray-100 hover:bg-gray-200 transition mb-2"
                                >
                                    ✏️ Edit Profile
                                </Link>
                            )}
                        </div>

                        {/* Channel Details */}
                        <div className="mt-3">
                            <h1 className="text-2xl font-bold text-gray-800">
                                {channel?.fullname}
                            </h1>
                            <p className="text-gray-500">@{channel?.username}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span>{formatCount(channel?.subscribersCount)} subscribers</span>
                                <span>{formatCount(channel?.channelsSubscribedToCount)} subscriptions</span>
                                <span>{videos.length} videos</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white border-b border-gray-200 px-8">
                        <div className="flex gap-8">
                            {["videos", "playlists"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 text-sm font-semibold capitalize border-b-2 transition ${
                                        activeTab === tab
                                            ? "border-red-600 text-red-600"
                                            : "border-transparent text-gray-500 hover:text-gray-800"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Videos Grid */}
                    <div className="p-8">
                        {activeTab === "videos" && (
                            <>
                                {videos.length === 0 ? (
                                    <div className="text-center py-16">
                                        <p className="text-4xl mb-4">🎬</p>
                                        <p className="text-gray-500">No videos yet</p>
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
                            </>
                        )}

                        {activeTab === "playlists" && (
                            <div className="text-center py-16">
                                <p className="text-4xl mb-4">📋</p>
                                <p className="text-gray-500">No playlists yet</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Channel;