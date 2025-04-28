import {
    createBrowserRouter,
} from "react-router-dom";
import Home from "../pages/App.jsx";
import PokemonForm from "../pages/PokemonForm.jsx";
import Login from "../pages/Login.jsx";
import ProtectedRoute from "./ProtectedRoute";
import Register from "../pages/Register.jsx";
import Game from "../pages/Game.jsx";

let router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/home",
        element: (
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        ),
    },
    {
        path: "/pokemon/:id",
        element: (
            <ProtectedRoute>
                <PokemonForm />
            </ProtectedRoute>
        ),
    },
    {
        path: "/pokemon/new",
        element: (
            <ProtectedRoute>
                <PokemonForm />
            </ProtectedRoute>
        ),
    },
    {
        path: "/game",
        element: (
            <ProtectedRoute>
                <Game />
            </ProtectedRoute>
        ),
    }
]);

export default router;
