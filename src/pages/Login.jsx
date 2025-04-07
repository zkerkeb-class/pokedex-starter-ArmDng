import LoginForm from "../components/LoginForm";
import { login } from "../services/auth";
import {useNavigate} from "react-router-dom";

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
        <div>
            <h1>Connexion</h1>
            <LoginForm onSubmit={handleLogin} />
        </div>
    );
};

export default Login;
