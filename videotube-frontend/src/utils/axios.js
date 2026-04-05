import axios from "axios";
import store from "../store/store.js";
import { logout } from "../store/slices/authSlice.js";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true
});

// Add token to every request automatically
axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.user?.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle token expiry automatically
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            store.dispatch(logout());
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;