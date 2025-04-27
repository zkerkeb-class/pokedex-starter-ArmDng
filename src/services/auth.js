import {api} from "./api.js";

// Fonction pour se connecter
export const login = async (username, password) => {
    try {
        const response = await api.post('/login', { username, password });
        if (response.data.token) {
            localStorage.setItem("token", response.data.token); 
        }
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Erreur serveur");
    }
};

// Fonction pour s'inscrire
export const register = async (username, password) => {
    try {
        const response = await api.post(`/register`, { username, password });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 429) {
            alert("Trop de tentatives. Veuillez réessayer plus tard.");
        } else {
            throw error.response ? error.response.data : new Error("Erreur serveur");
        }
    }
};

// Fonction pour se déconnecter
export const logout = () => {
    localStorage.removeItem("token"); 
};

// Fonction pour vérifier si un utilisateur est authentifié
export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};

// Ajouter cette fonction pour décoder le JWT
export const getUsernameFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
    try {
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        return decodedPayload.username;
    } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
        return null;
    }
};
