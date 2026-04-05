import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Header/Navbar.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import axiosInstance from "../utils/axios.js";

function Subscriptions() {
    const { user } = useSelector((state) => state.auth);
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const response = await axiosInstance.get(`/subscriptions/u/${user._id}`);
            setChannels(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch subscriptions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnsubscribe = async (channelId) => {
        try {
            await axiosInstance.post(`/subscriptions/c/${channelId}`);
            setChannels(channels.filter(c => c.channelDetails._id !== channelId));
        } catch (error) {
            console.error("Failed to unsubscribe:", error);
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
                        🎬 Subscriptions
                    </h1>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                        </div>
                    ) : channels.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-4xl mb-4">🎬</p>
                            <p className="text-gray-500 text-lg">No subscriptions yet</p>
                            <p className="text-gray-400 text-sm mt-2">
                                Subscribe to channels to see them here
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {channels.map((item) => (
                                <div
                                    key={item._id}
                                    className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-gray-100"
                                >
                                    {/* Channel Info */}
                                    <Link
                                        to={`/channel/${item.channelDetails?.username}`}
                                        className="flex items-center gap-4"
                                    >
                                        <img
                                            src={item.channelDetails?.avatar}
                                            alt={item.channelDetails?.username}
                                            className="w-14 h-14 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {item.channelDetails?.fullname}
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                @{item.channelDetails?.username}
                                            </p>
                                            {item.channelDetails?.latestVideo && (
                                                <p className="text-gray-400 text-xs mt-1">
                                                    Latest: {item.channelDetails.latestVideo.title}
                                                </p>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Unsubscribe Button */}
                                    <button
                                        onClick={() => handleUnsubscribe(item.channelDetails._id)}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition"
                                    >
                                        Unsubscribe
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Subscriptions;