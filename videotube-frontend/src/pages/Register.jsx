import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios.js";

function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        username: "",
        password: ""
    });

    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        setCoverImage(file);
        setCoverPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = new FormData();
            data.append("fullname", formData.fullname);
            data.append("email", formData.email);
            data.append("username", formData.username);
            data.append("password", formData.password);
            data.append("avatar", avatar);
            if (coverImage) data.append("coverImage", coverImage);

            await axiosInstance.post("/users/register", data);
            navigate("/login");

        } catch (error) {
            setError(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-md w-full mx-4">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-red-600">VideoTube</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Create your account</p>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                        Sign Up
                    </h2>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Cover Image */}
                        <div className="relative h-32 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden cursor-pointer"
                            onClick={() => document.getElementById("coverInput").click()}>
                            {coverPreview ? (
                                <img src={coverPreview} className="w-full h-full object-cover" alt="cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    Click to upload cover image
                                </div>
                            )}
                            <input id="coverInput" type="file" accept="image/*"
                                onChange={handleCoverChange} className="hidden" />
                        </div>

                        {/* Avatar */}
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden cursor-pointer flex-shrink-0"
                                onClick={() => document.getElementById("avatarInput").click()}>
                                {avatarPreview ? (
                                    <img src={avatarPreview} className="w-full h-full object-cover" alt="avatar" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400 text-xs text-center">
                                        Avatar
                                    </div>
                                )}
                                <input id="avatarInput" type="file" accept="image/*"
                                    onChange={handleAvatarChange} className="hidden" required />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Click circle to upload avatar (required)
                            </p>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center text-gray-500 dark:text-gray-400 mt-6 text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-red-600 hover:text-red-700 font-semibold">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;