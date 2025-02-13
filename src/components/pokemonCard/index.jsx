

const PokemonCard = ({ pokemon }) => {
    if (!pokemon) {
        return <div>Aucun Pokémon sélectionné</div>;
    }

    return (
        <div className="pokemon-card">
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
                    <span key={index} className={`type ${type}`}>
            {type}
          </span>
                ))}
            </div>

            <div className="stats-grid">
                <div className="stat-item">
                    <strong>Attaque</strong>
                    <strong>{pokemon.base.Attack}</strong>
                </div>
                <div className="stat-item">
                    <strong>Défense</strong>
                    <strong>{pokemon.base.Defense}</strong>
                </div>
                <div className="stat-item">
                    <strong>Vitesse</strong>
                    <strong>{pokemon.base.Speed}</strong>
                </div>
            </div>
        </div>
    );
};

export default PokemonCard;
