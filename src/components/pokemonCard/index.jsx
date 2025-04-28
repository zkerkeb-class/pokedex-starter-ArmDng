import './index.css';

const PokemonCard = ({ pokemon, onClick }) => {
    if (!pokemon) {
        return <div className="error-message">
            <h1>Aucun Pokémon sélectionné</h1>
        </div>;
    }

    return (
        <div className="pokemon-card" onClick={onClick}>
            <div className="card-header">
                <span className="hp">PV: {pokemon.base.HP}</span>
                <h2 className="pokemon-name">{pokemon.name.french}</h2>
            </div>

            <img
                src={pokemon.image}
                className="pokemon-image"
                alt={`${pokemon.name.french} image`}
            />

            <div className="type-container">
                {pokemon.type.map((type, index) => (
                    <img key={index} src={`${type}`} alt={`${type}`} />
                ))}
            </div>


            <div className="stats-line">
                <div className="stat-item">
                    <span className="stat-label">ATT</span>
                    <span className="stat-value">{pokemon.base.Attack}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">DEF</span>
                    <span className="stat-value">{pokemon.base.Defense}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">SPE</span>
                    <span className="stat-value">{pokemon.base.Speed}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">S. ATK</span>
                    <span className="stat-value">{pokemon.base.Sp_Attack}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">S. DEF</span>
                    <span className="stat-value">{pokemon.base.Sp_Defense}</span>
                </div>
            </div>


        </div>
    );
};

export default PokemonCard;
