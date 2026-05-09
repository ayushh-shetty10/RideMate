import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  timeout: 45000, // 45s timeout for slow free-tier responses
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
    // Check if the request was cancelled
    if (axios.isCancel(error)) {
      error.isCancelled = true;
      error.friendlyMessage = "Request cancelled";
      return Promise.reject(error);
    }

    // Handle network errors and timeouts specifically
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || !error.response) {
      error.friendlyMessage = "Connecting to RideMate servers... this might take up to 45 seconds to wake up. Please wait and try again.";
      return Promise.reject(error);
    }

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
