import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token"); // Récupérer le token JWT depuis le localStorage
    return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
