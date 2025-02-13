import './App.css';
import PokemonCard from "./components/pokemonCard/index.jsx";
import pokemons from "./assets/pokemons.js";


function App() {

    return (
        <>
            <div className="pokedex-header">
                <h1>Pokédex</h1>
            </div>
            <div className="pokemon-list">
                {pokemons.map(pokemon => (
                    <PokemonCard key={pokemon.id} pokemon={pokemon} />
                ))}
            </div>
        </>
    )

}

export default App;
