import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import PokemonCard from "../components/pokemonCard/index.jsx";
import SearchBar from "../components/searchBar/index.jsx";
import { getPaginatedPokemons } from "../services/apiPokemon.js";
import { searchPokemons } from "../services/apiPokemon.js";

function App() {
    const [search, setSearch] = useState("");
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [pokemonList, setPokemonList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isSearching, setIsSearching] = useState(false);

    const navigate = useNavigate();

    // Récupérer les données paginées au chargement ou lors du changement de page
    useEffect(() => {
        const fetchPokemons = async () => {
            if (isSearching) return; // Ne pas charger la pagination si en mode recherche

            try {
                setLoading(true);
                const data = await getPaginatedPokemons(page);
                setPokemonList(data.pokemons);
                setTotalPages(data.pages);
            } catch (err) {
                setError(`Erreur lors du chargement des Pokémon : ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemons();
    }, [page, isSearching]);

    // Effectuer une recherche globale lorsque l'utilisateur tape ou sélectionne des types
    useEffect(() => {
        const searchTimer = setTimeout(async () => {
            if (search.trim() === "" && selectedTypes.length === 0) {
                setIsSearching(false);
                return;
            }

            try {
                setLoading(true);
                setIsSearching(true);
                const result = await searchPokemons(search, selectedTypes);
                setPokemonList(result.pokemons || []);
                setTotalPages(1); // Pas de pagination en mode recherche
            } catch (err) {
                setError(`Erreur lors de la recherche : ${err.message}`);
            } finally {
                setLoading(false);
            }
        }, 500); // Délai de 500ms pour éviter trop de requêtes

        return () => clearTimeout(searchTimer);
    }, [search, selectedTypes]);

    const handleCardClick = (pokemonId) => {
        navigate(`/pokemon/${pokemonId}`);
    };

    const handleCreateClick = () => {
        navigate("/pokemon/new");
    };

    const handleClearSearch = () => {
        setSearch("");
        setSelectedTypes([]);
        setIsSearching(false);
        setPage(1);
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="app-container">
            <header className="pokedex-header">
                <div className="header-left">
                    <h1>Pokédex</h1>
                </div>

                <div className="header-center">
                    <SearchBar
                        search={search}
                        setSearch={setSearch}
                        selectedTypes={selectedTypes}
                        setSelectedTypes={setSelectedTypes}
                        onClear={handleClearSearch}
                    />
                </div>
                <div className="header-right">
                    <button className="create-button" onClick={handleCreateClick}>
                        Créer un Pokémon
                    </button>
                    <button className="logout-button" onClick={() => navigate("/login")}>
                        Déconnexion
                    </button>
                </div>
            </header>
            <main className="pokemon-list">
                {pokemonList.length > 0 ? (
                    pokemonList.map((pokemon) => (
                        <PokemonCard
                            key={pokemon.id}
                            pokemon={pokemon}
                            onClick={() => handleCardClick(pokemon.id)}
                        />
                    ))
                ) : (
                    <p className="no-pokemon-message">Aucun Pokémon trouvé</p>
                )}
            </main>
            {/* Pagination (visible uniquement si pas en mode recherche) */}
            {!isSearching && (
                <footer className="pagination">
                    <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                        Précédent
                    </button>
                    <span>Page {page} sur {totalPages}</span>
                    <input
                        type="number"
                        min="1"
                        max={totalPages}
                        placeholder="Aller à..."
                        onChange={(e) => {
                            const inputPage = parseInt(e.target.value);
                            if (inputPage >= 1 && inputPage <= totalPages) {
                                setPage(inputPage);
                            }
                        }}
                        style={{ width: "80px", marginLeft: "10px" }}
                    />
                    <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                        Suivant
                    </button>
                </footer>
            )}
        </div>
    );
}

export default App;