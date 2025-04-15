import LoginForm from "../components/LoginForm";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = async (username, password) => {
        try {
            await login(username, password);
            navigate("/home");
        } catch (error) {
            alert(error.message);
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
                <LoginForm onSubmit={handleLogin} />
            </div>
        </div>
    );
};

export default Login;