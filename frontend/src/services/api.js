import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  timeout: 15000, // 15s timeout for slow free-tier responses
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error handling
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      // Optional: trigger a logout or redirect
    }
    
    // Provide a cleaner error message
    const message = error.response?.data?.message || "Something went wrong. Please try again.";
    error.friendlyMessage = message;
    
    return Promise.reject(error);
  }
);

export default api;
