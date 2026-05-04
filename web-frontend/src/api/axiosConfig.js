import axios from 'axios';

// Ek axios ka instance create karein
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://schemevilla.onrender.com/api',
});

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

export default api;
