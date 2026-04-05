import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Header/Navbar.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import axiosInstance from "../utils/axios.js";

function VideoPlayer() {
    const { videoId } = useParams();
    const { user, theme } = useSelector((state) => state.auth);

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);


    useEffect(() => {
        fetchVideo();
        fetchComments();
    }, [videoId]);

    const fetchVideo = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/videos/${videoId}`);
            const videoData = response.data.data;
            setVideo(videoData);
            setIsLiked(videoData.isLiked);
            setLikesCount(videoData.likesCount);
            setIsSubscribed(videoData.owner?.isSubscribed);
        } catch (error) {
            console.error("Failed to fetch video:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axiosInstance.get(`/comments/${videoId}`);
            setComments(response.data.data.docs || []);
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        }
    };

    const handleLike = async () => {
        try {
            await axiosInstance.post(`/likes/toggle/v/${videoId}`);
            setIsLiked(!isLiked);
            setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
        } catch (error) {
            console.error("Failed to toggle like:", error);
        }
    };

    const handleSubscribe = async () => {
        try {
            await axiosInstance.post(`/subscriptions/c/${video.owner._id}`);
            setIsSubscribed(!isSubscribed);
        } catch (error) {
            console.error("Failed to toggle subscription:", error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const response = await axiosInstance.post(`/comments/${videoId}`, {
                content: newComment
            });
            setComments([response.data.data, ...comments]);
            setNewComment("");
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    };

    const formatViews = (views) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
        return views;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
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
                
                <Sidebar isOpen={sidebarOpen} />

                {/* Main Content */}
                <main style={{ marginLeft: 224, padding: 24, flex: 1 }}>
                    <div className="max-w-4xl mx-auto">

                        {/* Video Player */}
                        <div className="bg-black rounded-xl overflow-hidden aspect-video">
                            <video
                                src={video?.videoFile}
                                controls
                                autoPlay
                                className="w-full h-full"
                            />
                        </div>

                        {/* Video Title */}
                        <h1 className="text-xl font-bold text-gray-800 mt-4">
                            {video?.title}
                        </h1>

                        {/* Video Stats & Actions */}
                        <div className="flex items-center justify-between mt-2 pb-4 border-b border-gray-200">
                            <p className="text-gray-500 text-sm">
                                {formatViews(video?.views)} views • {formatDate(video?.createdAt)}
                            </p>

                            {/* Like Button */}
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                                    isLiked
                                        ? "bg-red-100 text-red-600"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                👍 {isLiked ? "Liked" : "Like"} • {likesCount}
                            </button>
                        </div>

                        {/* Channel Info */}
                        <div className="flex items-center justify-between py-4 border-b border-gray-200">
                            <Link
                                to={`/channel/${video?.owner?.username}`}
                                className="flex items-center gap-3"
                            >
                                <img
                                    src={video?.owner?.avatar}
                                    alt={video?.owner?.username}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {video?.owner?.fullname}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {formatViews(video?.owner?.subscribersCount)} subscribers
                                    </p>
                                </div>
                            </Link>

                            {/* Subscribe Button */}
                            {user?._id !== video?.owner?._id && (
                                <button
                                    onClick={handleSubscribe}
                                    className={`px-6 py-2 rounded-full font-semibold text-sm transition ${
                                        isSubscribed
                                            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                            : "bg-red-600 text-white hover:bg-red-700"
                                    }`}
                                >
                                    {isSubscribed ? "Subscribed ✓" : "Subscribe"}
                                </button>
                            )}
                        </div>

                        {/* Description */}
                        <div className="py-4 border-b border-gray-200">
                            <p className="text-gray-700 text-sm whitespace-pre-wrap">
                                {video?.description}
                            </p>
                        </div>

                        {/* Comments Section */}
                        <div className="mt-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">
                                Comments ({comments.length})
                            </h2>

                            {/* Add Comment */}
                            <form onSubmit={handleComment} className="flex gap-3 mb-6">
                                <img
                                    src={user?.avatar}
                                    alt={user?.username}
                                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                />
                                <div className="flex-1 flex gap-2">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="flex-1 px-4 py-2 border-b-2 border-gray-300 focus:border-red-500 focus:outline-none bg-transparent text-gray-800"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newComment.trim()}
                                        className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
                                    >
                                        Post
                                    </button>
                                </div>
                            </form>

                            {/* Comments List */}
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div key={comment._id} className="flex gap-3">
                                        <img
                                            src={comment.owner?.avatar}
                                            alt={comment.owner?.username}
                                            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                                        />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold text-gray-800">
                                                    @{comment.owner?.username}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {formatDate(comment.createdAt)}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-700 mt-1">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {comments.length === 0 && (
                                    <p className="text-center text-gray-500 py-8">
                                        No comments yet. Be the first to comment!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default VideoPlayer;