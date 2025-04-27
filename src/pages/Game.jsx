import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPokemonById, getPaginatedPokemons, searchPokemons } from '../services/apiPokemon';
import SearchBar from "../components/searchBar/index.jsx";
import PokemonCard from "../components/pokemonCard/index.jsx";
import AuthContext from "../contexts/AuthContext";
import './Game.css';

const RESOURCE_GOAL = 50;

const Game = () => {
    const [gamePhase, setGamePhase] = useState('selection');
    const [availablePokemon, setAvailablePokemon] = useState([]);
    const [selectedPokemonId, setSelectedPokemonId] = useState(null);
    const [loadingSelection, setLoadingSelection] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const { username } = useContext(AuthContext);
    const playerName = username || "Joueur";
    
    const [search, setSearch] = useState("");
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const [gameState, setGameState] = useState({
        players: [],
        resources: {},
        currentTurn: 0,
        day: 1,
        gameOver: false,
        winner: null,
        message: `Bienvenue dans la Guerre du Saint Pokemon, ${playerName}!`
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRules, setShowRules] = useState(false);
    const [combatPreview, setCombatPreview] = useState(null);
    const [showDefeatModal, setShowDefeatModal] = useState(false);
    const [defeatedBy, setDefeatedBy] = useState(null);
    const [showVictoryModal, setShowVictoryModal] = useState(false);
    const [victoryType, setVictoryType] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPokemons = async () => {
            if (gamePhase !== 'selection' || isSearching) return;

            try {
                setLoadingSelection(true);
                const data = await getPaginatedPokemons(page);
                setAvailablePokemon(data.pokemons);
                setTotalPages(data.pages);
            } catch (err) {
                setError(`Erreur lors du chargement des Pokémon: ${err.message}`);
            } finally {
                setLoadingSelection(false);
            }
        };

        fetchPokemons();
    }, [page, gamePhase, isSearching]);

    useEffect(() => {
        if (gamePhase !== 'selection') return;

        const searchTimer = setTimeout(async () => {
            if (search.trim() === "" && selectedTypes.length === 0) {
                setIsSearching(false);
                return;
            }

            try {
                setLoadingSelection(true);
                setIsSearching(true);
                const result = await searchPokemons(search, selectedTypes);
                setAvailablePokemon(result.pokemons || []);
                setTotalPages(1);
            } catch (err) {
                setError(`Erreur de recherche: ${err.message}`);
            } finally {
                setLoadingSelection(false);
            }
        }, 500);

        return () => clearTimeout(searchTimer);
    }, [search, selectedTypes, gamePhase]);

    const handleClearSearch = () => {
        setSearch("");
        setSelectedTypes([]);
        setIsSearching(false);
        setPage(1);
    };

    const selectPokemonAndStartGame = (pokemonId) => {
        setSelectedPokemonId(pokemonId);
        setGamePhase('game');
        setLoading(true);
    };

    const handlePokemonSelection = (pokemonId) => {
        selectPokemonAndStartGame(pokemonId);
    };

    useEffect(() => {
        const initGame = async () => {
            if (gamePhase !== 'game' || !selectedPokemonId) return;

            try {
                const newPlayers = [];
                
                const humanPokemon = await getPokemonById(selectedPokemonId);
                newPlayers.push({
                    id: 1,
                    name: playerName,
                    isHuman: true,
                    pokemon: humanPokemon,
                    resources: 0,
                    position: { x: 5, y: 5 },
                    isEliminated: false
                });
                
                const usedIds = new Set([selectedPokemonId]);
                const aiPokemonIds = [];
                
                while (aiPokemonIds.length < 6) {
                    const randomId = Math.floor(Math.random() * 151) + 1;
                    if (!usedIds.has(randomId)) {
                        aiPokemonIds.push(randomId);
                        usedIds.add(randomId);
                    }
                }
                
                for (let i = 0; i < 6; i++) {
                    const aiPokemon = await getPokemonById(aiPokemonIds[i]);
                    newPlayers.push({
                        id: i + 2,
                        name: `IA ${i + 1}`,
                        isHuman: false,
                        pokemon: aiPokemon,
                        resources: 0,
                        position: { x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10) },
                        isEliminated: false
                    });
                }
                
                const resourcePositions = {};
                for (let i = 0; i < 15; i++) {
                    const x = Math.floor(Math.random() * 10);
                    const y = Math.floor(Math.random() * 10);
                    const key = `${x}-${y}`;
                    resourcePositions[key] = {
                        amount: Math.floor(Math.random() * 3) + 1,
                        type: Math.random() > 0.5 ? 'food' : 'energy'
                    };
                }
                
                setGameState(prev => ({
                    ...prev,
                    players: newPlayers,
                    resources: resourcePositions
                }));
                
                setLoading(false);
            } catch (err) {
                setError(`Erreur d'initialisation du jeu: ${err.message}`);
                setLoading(false);
            }
        };
        
        initGame();
    }, [gamePhase, selectedPokemonId, playerName]);

    useEffect(() => {
        if (loading || gameState.gameOver || gamePhase !== 'game') return;
        
        const currentPlayer = gameState.players[gameState.currentTurn];
        if (!currentPlayer.isHuman && !currentPlayer.isEliminated) {
            handleAITurn();
        }
    }, [gameState.currentTurn, loading, gamePhase]);

    const movePlayer = (direction) => {
        if (gameState.gameOver) return;
        
        setGameState(prev => {
            const players = [...prev.players];
            const currentPlayer = players[prev.currentTurn];
            const newPosition = {...currentPlayer.position};
            
            switch(direction) {
                case 'up': newPosition.y = Math.max(0, newPosition.y - 1); break;
                case 'down': newPosition.y = Math.min(9, newPosition.y + 1); break;
                case 'left': newPosition.x = Math.max(0, newPosition.x - 1); break;
                case 'right': newPosition.x = Math.min(9, newPosition.x + 1); break;
                default: break;
            }
            
            currentPlayer.position = newPosition;
            
            const posKey = `${newPosition.x}-${newPosition.y}`;
            if (prev.resources[posKey]) {
                currentPlayer.resources += prev.resources[posKey].amount;
                
                const newMessage = `${currentPlayer.name} a collecté ${prev.resources[posKey].amount} ${prev.resources[posKey].type === 'food' ? 'nourriture' : 'énergie'}!`;
                
                const newResources = {...prev.resources};
                delete newResources[posKey];
                
                return {
                    ...prev,
                    players,
                    resources: newResources,
                    message: newMessage
                };
            }
            
            return {
                ...prev,
                players,
                message: `${currentPlayer.name} s'est déplacé en (${newPosition.x}, ${newPosition.y})`
            };
        });
        
        setCombatPreview(null);
    
        endTurn();
    };

    const handleAITurn = () => {
        if (gameState.gameOver) return;
        
        const currentPlayer = gameState.players[gameState.currentTurn];
        if (currentPlayer.isHuman) return;
        
        setTimeout(() => {
        
            const directions = ['up', 'down', 'left', 'right'];
            const randomDirection = directions[Math.floor(Math.random() * directions.length)];
            
            movePlayer(randomDirection);
            
            if (Math.random() < 0.4) {
                const nearbyPlayers = findNearbyPlayers(currentPlayer);
                if (nearbyPlayers.length > 0) {
                    const targetPlayer = nearbyPlayers[Math.floor(Math.random() * nearbyPlayers.length)];
                    initiateAttack(targetPlayer.id);
                }
            }
        }, 1000);
    };

    const findNearbyPlayers = (player) => {
        return gameState.players.filter(p => {
            if (p.id === player.id || p.isEliminated) return false;
            
            const distance = Math.abs(p.position.x - player.position.x) + 
                             Math.abs(p.position.y - player.position.y);
            return distance <= 2; 
        });
    };

    const showCombatPreview = (targetId) => {
        const currentPlayer = gameState.players[gameState.currentTurn];
        const targetPlayer = gameState.players.find(p => p.id === targetId);
        
        if (!targetPlayer || targetPlayer.isEliminated) return;
        
        const attackerStrength = currentPlayer.pokemon.base.Attack + currentPlayer.pokemon.base.Sp_Attack;
        const defenderStrength = targetPlayer.pokemon.base.Defense + targetPlayer.pokemon.base.Sp_Defense;
        
        const attackerChance = (attackerStrength / (attackerStrength + defenderStrength)) * 100;
        
        setCombatPreview({
            attacker: currentPlayer,
            defender: targetPlayer,
            attackerStrength,
            defenderStrength,
            attackerChance: Math.round(attackerChance)
        });
    };

    const initiateAttack = (targetId) => {
        if (gameState.gameOver) return;
        
        setGameState(prev => {
            const players = [...prev.players];
            const currentPlayer = players[prev.currentTurn];
            const targetPlayer = players.find(p => p.id === targetId);
            
            if (!targetPlayer || targetPlayer.isEliminated) {
                return {
                    ...prev,
                    message: "Cible invalide!"
                };
            }
            
            const attackerStrength = currentPlayer.pokemon.base.Attack + currentPlayer.pokemon.base.Sp_Attack;
            const defenderStrength = targetPlayer.pokemon.base.Defense + targetPlayer.pokemon.base.Sp_Defense;
            
            const attackRoll = attackerStrength * (1 + Math.random() * 0.4 - 0.2);
            const defenseRoll = defenderStrength * (1 + Math.random() * 0.4 - 0.2);
            
            let message = "";
            
            if (attackRoll > defenseRoll) {
            
                targetPlayer.isEliminated = true;
                message = `${currentPlayer.name} (${currentPlayer.pokemon.name.french}) a vaincu ${targetPlayer.name} (${targetPlayer.pokemon.name.french})!`;
                
                currentPlayer.resources += targetPlayer.resources;
                targetPlayer.resources = 0;
                
                if (targetPlayer.isHuman) {                
                    setDefeatedBy(currentPlayer);
                    setTimeout(() => {
                        setShowDefeatModal(true);
                    }, 500);
                }
                
                const remainingPlayers = players.filter(p => !p.isEliminated);
                if (remainingPlayers.length === 1) {
                    if (currentPlayer.isHuman) {
                        setVictoryType('elimination');
                        setTimeout(() => {
                            setShowVictoryModal(true);
                        }, 500);
                    }
                    
                    return {
                        ...prev,
                        players,
                        message,
                        gameOver: true,
                        winner: currentPlayer.id
                    };
                }
            } else {
                message = `${targetPlayer.name} (${targetPlayer.pokemon.name.french}) a résisté à l'attaque de ${currentPlayer.name} (${currentPlayer.pokemon.name.french})!`;
            }
            
            return {
                ...prev,
                players,
                message
            };
        });
        
        setCombatPreview(null);
        
        endTurn();
    };

    const endTurn = () => {
        setGameState(prev => {
            let nextTurn = (prev.currentTurn + 1) % prev.players.length;
            
            const remainingPlayers = prev.players.filter(p => !p.isEliminated);
            if (remainingPlayers.length === 1 && !prev.gameOver) {
                const winner = remainingPlayers[0];
                
                if (winner.isHuman) {
                    setVictoryType('elimination');
                    setTimeout(() => {
                        setShowVictoryModal(true);
                    }, 500);
                }
                
                return {
                    ...prev,
                    gameOver: true,
                    winner: winner.id,
                    message: `${winner.name} a vaincu tous les adversaires et remporte la victoire!`
                };
            }
            
            while (prev.players[nextTurn].isEliminated && !prev.gameOver) {
                nextTurn = (nextTurn + 1) % prev.players.length;
            }
            
            let newDay = prev.day;
            if (nextTurn === 0) {
                newDay += 1;
                
                const winner = prev.players.find(p => p.resources >= RESOURCE_GOAL);
                if (winner) {
                    if (winner.isHuman) {
                        setVictoryType('resources');
                        setTimeout(() => {
                            setShowVictoryModal(true);
                        }, 500);
                    }
                    
                    return {
                        ...prev,
                        currentTurn: nextTurn,
                        day: newDay,
                        gameOver: true,
                        winner: winner.id,
                        message: `${winner.name} a atteint l'objectif de ${RESOURCE_GOAL} ressources et remporte la victoire!`
                    };
                }
                
                if (newDay % 3 === 0) {
                    const newResources = {...prev.resources};
                    for (let i = 0; i < 5; i++) {
                        const x = Math.floor(Math.random() * 10);
                        const y = Math.floor(Math.random() * 10);
                        const key = `${x}-${y}`;
                        if (!newResources[key]) {
                            newResources[key] = {
                                amount: Math.floor(Math.random() * 3) + 1,
                                type: Math.random() > 0.5 ? 'food' : 'energy'
                            };
                        }
                    }
                    
                    return {
                        ...prev,
                        currentTurn: nextTurn,
                        day: newDay,
                        resources: newResources,
                        message: `Jour ${newDay} - De nouvelles ressources sont apparues!`
                    };
                }
                
                return {
                    ...prev,
                    currentTurn: nextTurn,
                    day: newDay,
                    message: `Jour ${newDay} - C'est au tour de ${prev.players[nextTurn].name}`
                };
            }
            
            return {
                ...prev,
                currentTurn: nextTurn,
                message: `C'est au tour de ${prev.players[nextTurn].name}`
            };
        });
    };


    const isCellAttackable = (x, y) => {
        if (gameState.gameOver) return false;
        
        const currentPlayer = gameState.players[gameState.currentTurn];
        if (!currentPlayer.isHuman) return false;
        
        const playerPosition = currentPlayer.position;
        const distance = Math.abs(x - playerPosition.x) + Math.abs(y - playerPosition.y);
        
        if (distance > 2) return false;
        
        return gameState.players.some(p => 
            p.position.x === x && 
            p.position.y === y && 
            !p.isEliminated && 
            p.id !== currentPlayer.id
        );
    };

    if (gamePhase === 'selection') {
        return (
            <div className="pokemon-selection">
                <div className="selection-header">
                    <h1>Choisissez votre Pokémon, {playerName}</h1>
                    <div className="selection-search-container">
                        <SearchBar
                            search={search}
                            setSearch={setSearch}
                            selectedTypes={selectedTypes}
                            setSelectedTypes={setSelectedTypes}
                            onClear={handleClearSearch}
                        />
                    </div>
                </div>
                
                <p className="selection-info">Les statistiques influencent vos chances de combat. Choisissez stratégiquement!</p>
                
                {loadingSelection ? (
                    <div className="loading-screen">Chargement des Pokémon disponibles...</div>
                ) : error ? (
                    <div className="error-screen">{error}</div>
                ) : (
                    <>
                        <div className="pokemon-list game-pokemon-list">
                            {availablePokemon && availablePokemon.length > 0 ? (
                                availablePokemon.map((pokemon) => (
                                    <PokemonCard
                                        key={pokemon.id}
                                        pokemon={pokemon}
                                        onClick={() => handlePokemonSelection(pokemon.id)}
                                        showStats={true}
                                    />
                                ))
                            ) : (
                                <p className="no-pokemon-message">Aucun Pokémon trouvé</p>
                            )}
                        </div>

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
                    </>
                )}
            </div>
        );
    }

    if (loading) return <div className="game-loading">Initialisation du jeu...</div>;
    if (error) return <div className="game-error">{error}</div>;
    
    const currentPlayer = gameState.players[gameState.currentTurn];
    const humanPlayer = gameState.players.find(p => p.isHuman);

    return (
        <div className="game-container">
            <button className="game-rules-button" onClick={() => setShowRules(true)}>
                Règles du jeu
            </button>
            
            <div className="game-header">
                <h1>Guerre du Saint Pokemon - Jour {gameState.day}</h1>
                <div className="game-status">
                    <p className="game-message">{gameState.message}</p>
                    {gameState.gameOver && (
                        <div className="game-over">
                            <h2>Partie terminée!</h2>
                            <p>Vainqueur: {gameState.players.find(p => p.id === gameState.winner).name}</p>
                            <button onClick={() => navigate('/home')}>Retour à l'accueil</button>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="game-info">
                <div className="player-info">
                    <h3>Votre Pokémon: {humanPlayer.pokemon.name.french}</h3>
                    <div className="player-stats">
                        <div className="stat-item-game">Ressources: {humanPlayer.resources}/{RESOURCE_GOAL}</div>
                        <div className="stat-item-game">Position: ({humanPlayer.position.x}, {humanPlayer.position.y})</div>
                        <div className="stat-item-game">Attaque: {humanPlayer.pokemon.base.Attack}</div>
                        <div className="stat-item-game">Attaque Spé: {humanPlayer.pokemon.base.Sp_Attack}</div>
                        <div className="stat-item-game">Défense: {humanPlayer.pokemon.base.Defense}</div>
                        <div className="stat-item-game">Défense Spé: {humanPlayer.pokemon.base.Sp_Defense}</div>
                    </div>
                    
                    {combatPreview && (
                        <div className="combat-preview">
                            <div className="combat-pokemon">
                                <div>{combatPreview.attacker.pokemon.name.french}</div>
                                <div>Force: {combatPreview.attackerStrength}</div>
                                <div>Chance: {combatPreview.attackerChance}%</div>
                            </div>
                            <div className="combat-vs">VS</div>
                            <div className="combat-pokemon">
                                <div>{combatPreview.defender.pokemon.name.french}</div>
                                <div>Force: {combatPreview.defenderStrength}</div>
                                <div>Chance: {100 - combatPreview.attackerChance}%</div>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="players-list">
                    <h3>Participants</h3>
                    <ul>
                        {gameState.players.map(player => (
                            <li key={player.id} className={player.isEliminated ? 'eliminated' : ''}>
                                <strong>{player.name} - {player.pokemon.name.french}</strong>
                                {!player.isEliminated && (
                                    <> - Ressources: {player.resources} 
                                    </>
                                )}
                                {player.isEliminated && ' (Éliminé)'}
                                {player.id === gameState.currentTurn + 1 && ' (Tour actuel)'}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            
            <div className="game-board">
                {/* Grille de jeu 10x10 */}
                {Array.from({ length: 10 }).map((_, y) => (
                    <div key={`row-${y}`} className="board-row">
                        {Array.from({ length: 10 }).map((_, x) => {
                            const playersHere = gameState.players.filter(p => 
                                p.position.x === x && p.position.y === y && !p.isEliminated
                            );
                            const resourceKey = `${x}-${y}`;
                            const hasResource = gameState.resources[resourceKey];
                            const isCurrentPlayerCell = currentPlayer && 
                                currentPlayer.position.x === x && 
                                currentPlayer.position.y === y;
                            const isAttackableCell = isCellAttackable(x, y);
                                                    
                            const isInAttackRange = currentPlayer && currentPlayer.isHuman && 
                                Math.abs(x - currentPlayer.position.x) + Math.abs(y - currentPlayer.position.y) <= 2 &&
                                !(x === currentPlayer.position.x && y === currentPlayer.position.y);
                            
                            return (
                                <div 
                                    key={`cell-${x}-${y}`} 
                                    className={`board-cell 
                                        ${playersHere.length > 0 ? 'has-player' : ''} 
                                        ${hasResource ? 'has-resource' : ''}
                                        ${isCurrentPlayerCell ? 'current-player-cell' : ''}
                                        ${isAttackableCell ? 'attackable-cell' : ''}
                                        ${isInAttackRange && !isAttackableCell ? 'in-attack-range' : ''}`
                                    }
                                    onClick={() => {
                                        if (currentPlayer.isHuman) {
                                            const currentPosition = currentPlayer.position;
                                            const distance = Math.abs(x - currentPosition.x) + Math.abs(y - currentPosition.y);
                                            
                                            if (distance <= 2) {
                                                const targetPlayer = gameState.players.find(p => 
                                                    p.position.x === x && p.position.y === y && !p.isEliminated
                                                );
                                                if (targetPlayer) {
                                                    if (combatPreview && combatPreview.defender.id === targetPlayer.id) {
                                                        initiateAttack(targetPlayer.id);
                                                    } else {
                                                        showCombatPreview(targetPlayer.id);
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                    onMouseEnter={() => {
                                        if (currentPlayer && currentPlayer.isHuman && isAttackableCell) {
                                            const targetPlayer = gameState.players.find(p => 
                                                p.position.x === x && p.position.y === y && !p.isEliminated
                                            );
                                            if (targetPlayer) {
                                                showCombatPreview(targetPlayer.id);
                                            }
                                        }
                                    }}
                                >
                                    {playersHere.length > 0 && (
                                        <div className="cell-player">
                                            <img 
                                                src={playersHere[0].pokemon.image} 
                                                alt={playersHere[0].pokemon.name.french}
                                                className="player-token"
                                                title={`${playersHere[0].name} - ${playersHere[0].pokemon.name.french}`}
                                            />
                                        </div>
                                    )}
                                    {hasResource && (
                                        <div 
                                            className={`resource ${gameState.resources[resourceKey].type}`}
                                            title={`${gameState.resources[resourceKey].amount} ${
                                                gameState.resources[resourceKey].type === 'food' ? 'nourriture' : 'énergie'
                                            }`}
                                        >
                                            {gameState.resources[resourceKey].amount}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            
            {currentPlayer && currentPlayer.isHuman && !gameState.gameOver && (
                <div className="game-controls">
                    <div className="movement-controls">
                        <button onClick={() => movePlayer('up')} title="Déplacer vers le haut">↑</button>
                        <div className="horizontal-controls">
                            <button onClick={() => movePlayer('left')} title="Déplacer vers la gauche">←</button>
                            <button onClick={() => movePlayer('right')} title="Déplacer vers la droite">→</button>
                        </div>
                        <button onClick={() => movePlayer('down')} title="Déplacer vers le bas">↓</button>
                    </div>
                    
                    <button onClick={endTurn} className="end-turn-button" title="Terminer votre tour sans bouger">
                        Terminer le tour
                    </button>
                </div>
            )}
            
            {showRules && (
                <div className="game-rules-modal">
                    <div className="game-rules-content">
                        <button className="close-button" onClick={() => setShowRules(false)}>×</button>
                        <h2>Règles du jeu - Guerre du Saint Pokemon</h2>
                        
                        <h3>Objectif</h3>
                        <p>Deux façons de gagner:</p>
                        <ul>
                            <li>Éliminer tous les autres participants</li>
                            <li>Collecter {RESOURCE_GOAL} ressources</li>
                        </ul>
                        
                        <h3>Déroulement</h3>
                        <ul>
                            <li>Chaque participant joue à tour de rôle</li>
                            <li>À votre tour, vous pouvez vous déplacer d'une case (haut, bas, gauche, droite)</li>
                            <li>Si vous arrivez sur une case avec une ressource, vous la collectez automatiquement</li>
                            <li>Vous pouvez attaquer un participant dans un rayon de 2 cases</li>
                            <li>Les cases à portée d'attaque sont marquées visuellement</li>
                            <li>Les combats sont déterminés par les statistiques des Pokémon et un facteur aléatoire</li>
                            <li>Si vous gagnez un combat, vous éliminez le Pokémon adverse et récupérez ses ressources</li>
                            <li>Une nouvelle journée commence quand tous les participants ont joué</li>
                            <li>Tous les 3 jours, de nouvelles ressources apparaissent sur la carte</li>
                        </ul>
                        
                        <h3>Combat</h3>
                        <p>Les combats sont basés sur les statistiques suivantes:</p>
                        <ul>
                            <li>Force d'attaque = Attaque + Attaque Spéciale</li>
                            <li>Force de défense = Défense + Défense Spéciale</li>
                            <li>Un facteur aléatoire de ±20% est appliqué à chaque combat</li>
                            <li>Si votre force d'attaque modifiée est supérieure à la force de défense de l'adversaire, vous gagnez</li>
                        </ul>
                        
                        <h3>Ressources</h3>
                        <ul>
                            <li>Nourriture (vert) et Énergie (orange) ont la même valeur</li>
                            <li>Collectez {RESOURCE_GOAL} unités pour gagner la partie</li>
                        </ul>
                    </div>
                </div>
            )}
            
            {showDefeatModal && (
                <div className="defeat-modal-overlay">
                    <div className="defeat-modal">
                        <div className="defeat-modal-content">
                            <h2 className="defeat-title">Vous avez été vaincu !</h2>
                            {defeatedBy && (
                                <div className="defeat-details">
                                    <p>Votre Pokémon {humanPlayer.pokemon.name.french} a été battu par</p>
                                    <div className="defeater-info">
                                        <img 
                                            src={defeatedBy.pokemon.image} 
                                            alt={defeatedBy.pokemon.name.french}
                                            className="defeater-image"
                                        />
                                        <p className="defeater-name">{defeatedBy.name} ({defeatedBy.pokemon.name.french})</p>
                                    </div>
                                    <div className="stat-comparison">
                                        <div className="your-stats">
                                            <p>Votre force: {humanPlayer.pokemon.base.Attack + humanPlayer.pokemon.base.Sp_Attack}</p>
                                            <p>Votre défense: {humanPlayer.pokemon.base.Defense + humanPlayer.pokemon.base.Sp_Defense}</p>
                                        </div>
                                        <div className="enemy-stats">
                                            <p>Force adversaire: {defeatedBy.pokemon.base.Attack + defeatedBy.pokemon.base.Sp_Attack}</p>
                                            <p>Défense adversaire: {defeatedBy.pokemon.base.Defense + defeatedBy.pokemon.base.Sp_Defense}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <p className="defeat-message">Votre aventure s'arrête ici...</p>
                            <button 
                                className="defeat-button"
                                onClick={() => navigate('/home')}
                            >
                                Retour à l'accueil
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {showVictoryModal && (
                <div className="victory-modal-overlay">
                    <div className="victory-modal">
                        <div className="victory-modal-content">
                            <h2 className="victory-title">Victoire !</h2>
                            <div className="victory-details">
                                <img 
                                    src={humanPlayer.pokemon.image} 
                                    alt={humanPlayer.pokemon.name.french}
                                    className="victory-pokemon-image"
                                />
                                <div className="victory-message">
                                    {victoryType === 'elimination' ? (
                                        <p>Votre Pokémon {humanPlayer.pokemon.name.french} a triomphé de tous ses adversaires !</p>
                                    ) : (
                                        <p>Vous avez collecté {RESOURCE_GOAL} ressources et remporté la victoire !</p>
                                    )}
                                </div>
                                <div className="victory-stats">
                                    <div className="stat-highlight">
                                        <span className="stat-label">Jours de campagne :</span>
                                        <span className="stat-value-victory">{gameState.day}</span>
                                    </div>
                                    <div className="stat-highlight">
                                        <span className="stat-label">Ressources collectées :</span>
                                        <span className="stat-value-victory">{humanPlayer.resources}</span>
                                    </div>
                                    <div className="stat-highlight">
                                        <span className="stat-label">Force d'attaque :</span>
                                        <span className="stat-value-victory">{humanPlayer.pokemon.base.Attack + humanPlayer.pokemon.base.Sp_Attack}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="victory-trophy">
                                <span className="trophy-icon">🏆</span>
                            </div>
                            <p className="victory-end-message">Félicitations, {playerName} !</p>
                            <button 
                                className="victory-button"
                                onClick={() => navigate('/home')}
                            >
                                Retour à l'accueil
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Game;