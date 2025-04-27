import {api} from "./api.js";


export const getAllPokemons = async () => {
    try {
        const response = await api.get('/pokemons');
        return response.data;
    } catch (error) {
        console.error("Erreur while getting Pokemons", error);
        throw new Error("Erreur lors de la récupération des Pokémon. Veuillez réessayer ultérieurement.", error);
    }
}
// Fonction pour récupérer les Pokémon paginés
export const getPaginatedPokemons = async (page, limit = 12) => {
    try {
        const response = await api.get(`/pokemons?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Erreur while getting Pokemons", error);
        throw new Error("Erreur lors de la récupération des Pokémon. Veuillez réessayer ultérieurement.", error);
    }
};

// Fonction pour récupérer un Pokémon par son ID
export const getPokemonById = async (id) => {
    try {
        const response = await api.get('/pokemons/' + id);
        return response.data;
    } catch (error) {
        console.error('Error while fetching pokemons with the id ', id, error);
        throw new Error('Erreur lors de la récupération du Pokémon. Veuillez réessayer ultérieurement.', error);
    }
}

// Fonction pour créer un Pokémon
export const createPokemon = async (pokemon) => {
    try {
        const response = await api.post('/pokemons/', pokemon);
        return response.data;
    } catch (error) {
        console.error('Error while creating pokemon', error);
        throw new Error('Erreur lors de la création du Pokémon. Veuillez réessayer ultérieurement.', error);
    }
}

// Fonction pour mettre à jour un Pokémon
export const updatePokemon = async (id, pokemon) => {
    try {
        const response = await api.put(`/pokemons/${id}`, pokemon);
        return response.data;
    } catch (error) {
        console.error('Error while updating pokemon', error);
        throw new Error('Erreur lors de la mise à jour du Pokémon. Veuillez réessayer ultérieurement.', error);
    }
}

// Fonction pour rechercher des pokémons globalement
export const searchPokemons = async (searchTerm, types = []) => {
    try {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (types && types.length > 0) params.types = types.join(',');

        const response = await api.get('/pokemons/', { params });
        return response.data;
    } catch (error) {
        console.error("Error while searching Pokemons", error);
        throw new Error("Erreur lors de la recherche des Pokémon. Veuillez réessayer ultérieurement.", error);
    }
};

// Fonction pour supprimer un Pokémon
export const deletePokemon = async (id) => {
    try {
        const response = await api.delete(`/pokemons/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error while deleting pokemon', error);
        throw new Error('Erreur lors de la suppression du Pokémon. Veuillez réessayer ultérieurement.', error);
    }
}