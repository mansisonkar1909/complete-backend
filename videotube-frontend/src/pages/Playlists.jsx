import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Header/Navbar.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import axiosInstance from "../utils/axios.js";

function Playlists() {
    const { user } = useSelector((state) => state.auth);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        try {
            const response = await axiosInstance.get(`/playlists/user/${user._id}`);
            setPlaylists(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch playlists:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        setError(null);
        try {
            const response = await axiosInstance.post("/playlists", formData);
            setPlaylists([...playlists, response.data.data]);
            setShowModal(false);
            setFormData({ name: "", description: "" });
        } catch (error) {
            setError(error.response?.data?.message || "Failed to create playlist");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (playlistId) => {
        if (!window.confirm("Delete this playlist?")) return;
        try {
            await axiosInstance.delete(`/playlists/${playlistId}`);
            setPlaylists(playlists.filter(p => p._id !== playlistId));
        } catch (error) {
            console.error("Failed to delete playlist:", error);
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

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">
                            📋 My Playlists
                        </h1>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
                        >
                            + New Playlist
                        </button>
                    </div>

                    {/* Loading */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                        </div>
                    ) : playlists.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-4xl mb-4">📋</p>
                            <p className="text-gray-500 text-lg">No playlists yet</p>
                            <p className="text-gray-400 text-sm mt-2">
                                Create your first playlist!
                            </p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-xl text-sm"
                            >
                                Create Playlist
                            </button>
                        </div>
                    ) : (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                            gap: 24
                        }}>
                            {playlists.map((playlist) => (
                                <div
                                    key={playlist._id}
                                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition"
                                >
                                    {/* Playlist Thumbnail */}
                                    <Link to={`/playlist/${playlist._id}`}>
                                        <div className="bg-gray-200 h-40 flex items-center justify-center">
                                            <p className="text-4xl">📋</p>
                                        </div>
                                    </Link>

                                    {/* Playlist Info */}
                                    <div className="p-4">
                                        <Link to={`/playlist/${playlist._id}`}>
                                            <h3 className="font-semibold text-gray-800 hover:text-red-600 transition">
                                                {playlist.name}
                                            </h3>
                                        </Link>
                                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                                            {playlist.description}
                                        </p>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-xs text-gray-500">
                                                {playlist.totalVideos || 0} videos
                                            </span>
                                            <button
                                                onClick={() => handleDelete(playlist._id)}
                                                className="text-red-500 hover:text-red-600 text-xs"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Create Playlist Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Create New Playlist
                        </h2>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="Playlist name"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Playlist description"
                                    required
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
                                >
                                    {creating ? "Creating..." : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Playlists;