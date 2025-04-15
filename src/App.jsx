import {RouterProvider} from "react-router-dom";
import routes from "./config/routes.jsx";

const App = () => {
    return (
        <RouterProvider router={routes} />
    )
}

export default App;