import axios from 'axios';
import { auth } from '../config/firebase';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/frenchify/us-central1/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach Firebase ID token
api.interceptors.request.use(
    async (config) => {
        const user = auth.currentUser;
        console.log('🔍 API Request:', config.url, 'User:', user?.email);
        if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
            console.log('✅ Token attached to request');
        } else {
            console.log('⚠️ No user logged in, skipping token');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('❌ API Error:', error.response?.status, error.message);
        // Don't redirect on 401 here - let PrivateRoute handle it via React Router
        // Using window.location.href causes a full page reload and breaks React state
        return Promise.reject(error);
    }
);

export default api;
