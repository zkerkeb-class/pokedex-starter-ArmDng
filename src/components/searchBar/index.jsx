import "./index.css";

const types = [
    "Bug",
    "Dark",
    "Dragon",
    "Electric",
    "Fairy",
    "Fighting",
    "Fire",
    "Flying",
    "Ghost",
    "Grass",
    "Ground",
    "Ice",
    "Normal",
    "Poison",
    "Psychic",
    "Rock",
    "Steel",
    "Water",
];

const SearchBar = ({ search, setSearch, selectedTypes, setSelectedTypes }) => {
    return (
        <div className="search-container">
            {/* Barre de recherche */}
            <div className="search-bar-container">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-bar"
                    type="text"
                    placeholder="Rechercher un Pokémon"
                />
                <button
                    className="clear-button"
                    onClick={() => setSearch("")}
                >
                    X
                </button>
            </div>

            <div className="dropdown-container">
                <select
                    className="dropdown"
                    onChange={(e) => {
                        const selectedType = e.target.value;
                        if (!selectedTypes.includes(selectedType) && selectedType !== "") {
                            setSelectedTypes([...selectedTypes, selectedType]);
                        }
                    }}
                >
                    <option value="">Filtrer par type</option>
                    {types.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>

                <div className="selected-types">
                    {selectedTypes.map((type) => (
                        <span
                            key={type}
                            className="selected-type"
                            onClick={() =>
                                setSelectedTypes(selectedTypes.filter((t) => t !== type))
                            }
                        >
                            {type} ✕
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
