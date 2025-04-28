const API_BASE_URL = 'http://localhost:3000/api';
import axios from "axios";

export const api = axios.create({
    baseURL: API_BASE_URL,
});

// Intercepteur pour ajouter dynamiquement le token JWT à chaque requête
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Intercepteur pour gérer les tokens expirés
api.interceptors.response.use(
    response => response,
    error => {
        const excludedEndpoints = ['/login', '/register']; // Liste des endpoints à exclure
        if (
            error.response &&
            error.response.status === 401 &&
            !excludedEndpoints.some(endpoint => error.config.url.includes(endpoint))
        ) {
            localStorage.removeItem('token');

            const event = new CustomEvent('tokenExpired');
            window.dispatchEvent(event);
        }
        return Promise.reject(error);
    }
);