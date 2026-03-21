import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/home.jsx";

function App() {
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Routes>
                <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
                <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
                <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
            </Routes>
        </div>
    );
}

export default App;