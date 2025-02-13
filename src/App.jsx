import './App.css';
import PokemonCard from "./components/pokemonCard/index.jsx";
import pokemons from "./assets/pokemons.js";

const bulbizarre = pokemons[0];

function App() {

    return (
        <>
            <PokemonCard pokemon={bulbizarre}></PokemonCard>
        </>
    )

}

export default App;
