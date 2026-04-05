import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Upload from "./pages/Upload.jsx";
import VideoPlayer from "./pages/VideoPlayer.jsx";
import Channel from "./pages/Channel.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import LikedVideos from "./pages/LikedVideos.jsx";
import History from "./pages/History.jsx";
import Playlists from "./pages/Playlists.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";

function App() {
    const { isAuthenticated, theme } = useSelector((state) => state.auth);

    // Apply dark mode to html element
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    return (
        <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
            <Routes>
                <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
                <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
                <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
                <Route path="/upload" element={isAuthenticated ? <Upload /> : <Navigate to="/login" />} />
                <Route path="/video/:videoId" element={isAuthenticated ? <VideoPlayer /> : <Navigate to="/login" />} />
                <Route path="/channel/:username" element={isAuthenticated ? <Channel /> : <Navigate to="/login" />} />
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/liked-videos" element={isAuthenticated ? <LikedVideos /> : <Navigate to="/login" />} />
                <Route path="/history" element={isAuthenticated ? <History /> : <Navigate to="/login" />} />
                <Route path="/playlists" element={isAuthenticated ? <Playlists /> : <Navigate to="/login" />} />
                <Route path="/subscriptions" element={isAuthenticated ? <Subscriptions /> : <Navigate to="/login" />} />
            </Routes>
        </div>
    );
}

export default App;