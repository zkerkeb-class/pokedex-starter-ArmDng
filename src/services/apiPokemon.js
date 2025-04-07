import {api} from "./api.js";

// Fonction pour récupérer les Pokémon paginés
export const getPaginatedPokemons = async (page, limit = 12) => {
    try {
        const response = await api.get(`/pokemons?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        throw new Error("Erreur lors de la récupération des Pokémon");
    }
};

// Fonction pour récupérer un Pokémon par son ID
export const getPokemonById = async (id) => {
    try {
        const response = await api.get('/pokemons/' + id);
        return response.data;
    } catch (error) {
        console.error('Error while fetching pokemons with the id ', id, error);
        throw error;
    }
}

// Fonction pour créer un Pokémon
export const createPokemon = async (pokemon) => {
    try {
        const response = await api.post('/pokemons/', pokemon);
        return response.data;
    } catch (error) {
        console.error('Error while creating pokemon', error);
        throw error;
    }
}

// Fonction pour mettre à jour un Pokémon
export const updatePokemon = async (id, pokemon) => {
    try {
        const response = await api.put(`/pokemons/${id}`, pokemon);
        return response.data;
    } catch (error) {
        console.error('Error while updating pokemon', error);
        throw error;
    }
}

// Fonction pour supprimer un Pokémon
export const deletePokemon = async (id) => {
    try {
        const response = await api.delete(`/pokemons/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error while deleting pokemon', error);
        throw error;
    }
}