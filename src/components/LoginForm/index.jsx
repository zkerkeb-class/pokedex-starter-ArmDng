import { useState } from "react";
import { Link } from "react-router-dom";
import "./LoginForm.css";

const LoginForm = ({ onSubmit, isRegisterMode = false }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isRegisterMode && password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas !");
            return;
        }
        onSubmit(username, password);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="username">Nom d'utilisateur</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            {isRegisterMode && (
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
            )}
            <button type="submit" className="submit-button">
                {isRegisterMode ? "S'inscrire" : "Se connecter"}
            </button>
            {!isRegisterMode && (
                <div className="form-footer">
                    <p>Pas encore de compte ? <Link to="/register">Créer un compte</Link></p>
                </div>
            )}
            {isRegisterMode && (
                <div className="form-footer">
                    <p>Déjà un compte ? <Link to="/login">Se connecter</Link></p>
                </div>
            )}
        </form>
    );
};

export default LoginForm;