import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Header/Navbar.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import axiosInstance from "../utils/axios.js";

function Upload() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [formData, setFormData] = useState({
        title: "",
        description: ""
    });

    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        setThumbnail(file);
        setThumbnailPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!videoFile) {
            setError("Please select a video file");
            return;
        }
        if (!thumbnail) {
            setError("Please select a thumbnail");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("videoFile", videoFile);
            data.append("thumbnail", thumbnail);

            await axiosInstance.post("/videos", data, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(progress);
                }
            });

            navigate("/");
        } catch (error) {
            setError(error.response?.data?.message || "Upload failed");
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div style={{ display: "flex", paddingTop: 56 }}>
                {/* Sidebar */}
               
                <Sidebar isOpen={sidebarOpen} />

                {/* Main Content */}
                <main style={{ marginLeft: 224, padding: 24, flex: 1 }}>
                    <div className="max-w-2xl mx-auto">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">
                            Upload Video
                        </h1>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Video Upload */}
                            <div
                                onClick={() => document.getElementById("videoInput").click()}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-red-400 transition"
                            >
                                {videoPreview ? (
                                    <video
                                        src={videoPreview}
                                        controls
                                        className="w-full rounded-lg max-h-48"
                                    />
                                ) : (
                                    <div>
                                        <p className="text-4xl mb-2">🎬</p>
                                        <p className="text-gray-600 font-medium">
                                            Click to upload video
                                        </p>
                                        <p className="text-gray-400 text-sm mt-1">
                                            MP4, MOV, AVI supported
                                        </p>
                                    </div>
                                )}
                                <input
                                    id="videoInput"
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoChange}
                                    className="hidden"
                                />
                            </div>

                            {/* Thumbnail Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Thumbnail
                                </label>
                                <div
                                    onClick={() => document.getElementById("thumbnailInput").click()}
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-red-400 transition"
                                >
                                    {thumbnailPreview ? (
                                        <img
                                            src={thumbnailPreview}
                                            alt="thumbnail"
                                            className="w-full max-h-40 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div>
                                            <p className="text-2xl mb-1">🖼️</p>
                                            <p className="text-gray-500 text-sm">
                                                Click to upload thumbnail
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        id="thumbnailInput"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter video title"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter video description"
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                                />
                            </div>

                            {/* Progress Bar */}
                            {loading && (
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-red-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                    <p className="text-sm text-gray-500 mt-1 text-center">
                                        Uploading... {uploadProgress}%
                                    </p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? `Uploading... ${uploadProgress}%` : "Upload Video"}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Upload;