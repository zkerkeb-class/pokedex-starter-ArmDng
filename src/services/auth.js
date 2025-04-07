import {api} from "./api.js";

// Fonction pour se connecter
export const login = async (username, password) => {
    try {
        const response = await api.post('/login', { username, password });
        if (response.data.token) {
            localStorage.setItem("token", response.data.token); // Stocker le token JWT dans le localStorage
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
            alert("Erreur lors de l'inscription.");
        }
    }
};



// Fonction pour se déconnecter
export const logout = () => {
    localStorage.removeItem("token"); // Supprime le token du localStorage
};

// Fonction pour vérifier si un utilisateur est authentifié
export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};
