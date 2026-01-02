import axios from "axios";

// In development, use relative URLs and let Vite proxy handle /api -> server
// In production, use the absolute base URL from VITE_BASE_URL
const baseURL = import.meta.env.PROD
  ? (import.meta.env.VITE_BASE_URL || "")
  : "";

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api