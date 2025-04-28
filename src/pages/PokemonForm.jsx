import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {getPokemonById, createPokemon, updatePokemon, deletePokemon} from "../services/apiPokemon.js";
import "./PokemonForm.css";

const PokemonForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isCreating = !id;

    const [formData, setFormData] = useState({
        name: { french: "" },
        type: [],
        base: { HP: 0, Attack: 0, Defense: 0, Sp_Attack: 0, Sp_Defense: 0, Speed: 0 },
        image: "",
    });
    const [loading, setLoading] = useState(!isCreating);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isCreating) {
            const fetchPokemonDetails = async () => {
                try {
                    const pokemonData = await getPokemonById(id);
                    setFormData(pokemonData);
                } catch (err) {
                    setError(`Erreur lors de la récupération des détails : ${err.message}`);
                } finally {
                    setLoading(false);
                }
            };

            fetchPokemonDetails();
        }
    }, [id, isCreating]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("base.")) {
            const statName = name.replace("base.", "");
            setFormData((prevFormData) => ({
                ...prevFormData,
                base: { ...prevFormData.base, [statName]: parseInt(value) || 0 },
            }));
        } else if (name === "type") {
            setFormData((prevFormData) => ({
                ...prevFormData,
                type: value.split(",").map((type) => type.trim()),
            }));
        } else if (name === "image") {
            setFormData((prevFormData) => ({
                ...prevFormData,
                image: value,
            }));
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                name: { ...prevFormData.name, french: value },
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const cleanedData = {
                ...formData,
                evolutions: [],
            };

            if (isCreating) {
                await createPokemon(cleanedData);
                alert("Pokémon créé avec succès !");
            } else {
                await updatePokemon(id, cleanedData);
                alert("Pokémon modifié avec succès !");
            }

            navigate("/home");
        } catch (err) {
            if (err.response && err.response.data) {
                alert(`Erreur lors de la soumission : ${JSON.stringify(err.response.data)}`);
            } else {
                alert(`Erreur lors de la soumission : ${err.message}`);
            }
        }
    };

    const handleCancel = () => navigate("/home");

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            await deletePokemon(id);
            alert("Pokémon supprimé avec succès !");
            navigate("/home");
        } catch (err) {
            if (err.response && err.response.data) {
                alert(`Erreur lors de la soumission : ${JSON.stringify(err.response.data)}`);
            } else {
                alert(`Erreur lors de la soumission : ${err.message}`);
            }
        }
    }

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="pokemon-form-container">
            <div className="pokemon-image-container">
                {formData.image ? (
                    <img src={formData.image} alt={formData.name.french} className="pokemon-image" />
                ) : (
                    <p>Aucune image disponible</p>
                )}
            </div>
            <div className="pokemon-form-wrapper">
                <h1>{isCreating ? "Créer un nouveau Pokémon" : `Modifier ${formData.name.french}`}</h1>
                <form className="pokemon-form" onSubmit={handleSubmit}>
                    <label>
                        Nom :
                        <input
                            type="text"
                            name="name"
                            value={formData.name.french}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Type(s) (séparés par des virgules) :
                        <input
                            type="text"
                            name="type"
                            value={formData.type.join(",")}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Image (URL) :
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        PV :
                        <input
                            type="number"
                            name="base.HP"
                            value={formData.base.HP}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Attaque :
                        <input
                            type="number"
                            name="base.Attack"
                            value={formData.base.Attack}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Défense :
                        <input
                            type="number"
                            name="base.Defense"
                            value={formData.base.Defense}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Sp. Attaque :
                        <input
                            type="number"
                            name="base.Sp_Attack"
                            value={formData.base.Sp_Attack}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Sp. Défense :
                        <input
                            type="number"
                            name="base.Sp_Defense"
                            value={formData.base.Sp_Defense}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Vitesse :
                        <input
                            type="number"
                            name="base.Speed"
                            value={formData.base.Speed}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <button type="submit" className="submit-pokemon-button">
                        {isCreating ? "Créer" : "Modifier"}
                    </button>
                    <button type="button" className="cancel-button" onClick={handleCancel}>
                        Annuler
                    </button>
                    <button type="button" className="delete-button" onClick={handleDelete}>
                        Supprimer
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PokemonForm;
