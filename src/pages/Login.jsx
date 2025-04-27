import { useState } from "react";
import LoginForm from "../components/LoginForm";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css";
// Suppression de l'import inutilisé de useAuth

const Login = () => {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState(null);

    const handleLogin = async (username, password) => {
        try {
            setLoginError(null); 
            const response = await login(username, password);

            navigate("/home");
        } catch (error) {
            setLoginError(error.message);
            console.error("Erreur de connexion:", error.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <img
                        src="/pokemon-logo.png"
                        alt="Pokemon Logo"
                        className="pokemon-logo"
                    />
                    <h1>Connexion</h1>
                    <p>Connectez-vous pour accéder à votre Pokédex</p>
                </div>
                <LoginForm onSubmit={handleLogin} error={loginError} />
            </div>
        </div>
    );
};

export default Login;