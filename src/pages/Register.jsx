import LoginForm from "../components/LoginForm";
import { register } from "../services/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Partage le même style que Login

const Register = () => {
    const navigate = useNavigate();

    const handleRegister = async (username, password) => {
        try {
            await register(username, password);
            navigate("/login");
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
                    <h1>Créer un compte</h1>
                    <p>Rejoignez-nous pour commencer votre aventure Pokémon</p>
                </div>
                <LoginForm onSubmit={handleRegister} isRegisterMode={true} />
            </div>
        </div>
    );
};

export default Register;