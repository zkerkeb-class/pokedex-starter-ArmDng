import { useNavigate } from "react-router-dom";
import { register } from "../services/auth";
import LoginForm from "../components/LoginForm/index.jsx";

const Register = () => {
    const navigate = useNavigate();

    const handleRegister = async (username, password) => {
        try {
            await register(username, password);
            alert("Compte créé avec succès !");
            navigate("/login");
        } catch (error) {
            alert(error.message || "Échec de l'inscription");
        }
    };

    return (
        <div>
            <h2>Créer un compte</h2>
            <LoginForm onSubmit={handleRegister} isRegisterMode={true} /> {}
        </div>
    );
};

export default Register;
