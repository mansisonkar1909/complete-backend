import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    theme: localStorage.getItem("theme") || "light"
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.error = null;

            if (action.payload.accessToken) {
                state.user.accessToken = action.payload.accessToken;
            }
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
        updateUser: (state, action) => {
            state.user = action.payload;
        },
        toggleTheme: (state) => {
            state.theme = state.theme === "light" ? "dark" : "light";
            localStorage.setItem("theme", state.theme);
        }
    }
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser, toggleTheme } = authSlice.actions;
export default authSlice.reducer;