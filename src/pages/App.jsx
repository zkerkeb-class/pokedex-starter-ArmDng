import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import PokemonCard from "../components/pokemonCard/index.jsx";
import SearchBar from "../components/searchBar/index.jsx";
import { getPaginatedPokemons } from "../services/apiPokemon.js";

function App() {
    const [search, setSearch] = useState("");
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [pokemonList, setPokemonList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1); // Page actuelle
    const [totalPages, setTotalPages] = useState(1); // Nombre total de pages

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPokemons = async () => {
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
    }, [page]);

    const handleCardClick = (pokemonId) => {
        navigate(`/pokemon/${pokemonId}`);
    };

    const handleCreateClick = () => {
        navigate("/pokemon/new");
    };

    const handlePageInputChange = (e) => {
        const inputPage = parseInt(e.target.value);
        if (inputPage >= 1 && inputPage <= totalPages) {
            setPage(inputPage);
        } else {
            alert(`Veuillez entrer un numéro entre 1 et ${totalPages}`);
        }
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="app-container">
            <header className="pokedex-header">
                <h1>Pokédex</h1>
                <SearchBar
                    search={search}
                    setSearch={setSearch}
                    selectedTypes={selectedTypes}
                    setSelectedTypes={setSelectedTypes}
                />
                <button className="create-button" onClick={handleCreateClick}>
                    Créer un Pokémon
                </button>
                <button className="logout-button" onClick={() => navigate("/login")}>
                    Déconnexion
                </button>
            </header>
            <main className="pokemon-list">
                {pokemonList &&
                    pokemonList.length > 0 &&
                    pokemonList.map((pokemon) => (
                        <PokemonCard
                            key={pokemon.id}
                            pokemon={pokemon}
                            onClick={() => handleCardClick(pokemon.id)}
                        />
                    ))}
            </main>
            {/* Pagination */}
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
                    onChange={handlePageInputChange}
                    style={{ width: "80px", marginLeft: "10px" }}
                />
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                    Suivant
                </button>
            </footer>
        </div>
    );
}

export default App;
