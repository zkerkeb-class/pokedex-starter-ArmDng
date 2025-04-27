import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import PokemonCard from "../components/pokemonCard/index.jsx";
import SearchBar from "../components/searchBar/index.jsx";
import { getPaginatedPokemons } from "../services/apiPokemon.js";
import { searchPokemons } from "../services/apiPokemon.js";
import AuthContext from "../contexts/AuthContext";

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
    const { username } = useContext(AuthContext);

    useEffect(() => {
        const fetchPokemons = async () => {
            if (isSearching) return; 

            try {
                setLoading(true);
                const data = await getPaginatedPokemons(page);
                setPokemonList(data.pokemons);
                setTotalPages(data.pages);
            } catch (err) {
                setError(`${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemons();
    }, [page, isSearching]);

    
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
                setTotalPages(1); 
            } catch (err) {
                setError(`${err.message}`);
            } finally {
                setLoading(false);
            }
        }, 500); 

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

    const handleLogout = () => {
        navigate("/login");
    };

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="app-container">
            <header className="pokedex-header">
                <h1>Pokédex</h1>
                <div className="search-container">
                <SearchBar
                        search={search}
                        setSearch={setSearch}
                        selectedTypes={selectedTypes}
                        setSelectedTypes={setSelectedTypes}
                        onClear={handleClearSearch}
                    />
                </div>
                <div className="header-right">
                <button className="game-button" onClick={() => navigate("/game")}>
                        Jouer
                    </button>
                    <button className="create-button" onClick={handleCreateClick}>
                        Créer un Pokémon
                    </button>
                    {username && <span className="username">Bonjour, {username}</span>}
                    <button className="logout-button" onClick={handleLogout}>
                        Déconnexion
                    </button>
                </div>
            </header>
            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>✕</button>
                </div>
            )}
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