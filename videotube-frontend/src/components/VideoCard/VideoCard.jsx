import { Link } from "react-router-dom";

function VideoCard({ video }) {
    const formatViews = (views) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
        return views;
    };

    const formatDate = (date) => {
        const diff = Date.now() - new Date(date);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        if (days < 365) return `${Math.floor(days / 30)} months ago`;
        return `${Math.floor(days / 365)} years ago`;
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <Link to={`/video/${video._id}`} className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition duration-200">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                    />
                    {/* Duration Badge */}
                    <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                        {formatDuration(video.duration)}
                    </span>
                </div>

                {/* Video Info */}
                <div className="p-3 flex gap-3">
                    {/* Owner Avatar */}
                    <img
                        src={video.ownerDetails?.avatar}
                        alt={video.ownerDetails?.username}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 dark:text-white text-sm line-clamp-2 group-hover:text-red-600 transition">
                            {video.title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                            {video.ownerDetails?.username}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                            {formatViews(video.views)} views • {formatDate(video.createdAt)}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default VideoCard;