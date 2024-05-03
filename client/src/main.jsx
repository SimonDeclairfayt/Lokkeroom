import ReactDOM from "react-dom/client";
import Homepage from "./home/Home";
import Login from "./login/Login";
import Register from "./register/Register";
import CreateLobby from "./create-lobby/CreateLobby";
import Lobby from "./lobbies/Lobby";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
    errorElement: <div>Oups</div>,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <div>Oups</div>,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <div>Oups</div>,
  },
  {
    path: "/create-lobby",
    element: <CreateLobby />,
    errorElement: <div>Oups from create lobby</div>,
  },
  {
    path: "/lobby/:id",
    element: <Lobby />,
    errorElement: <div>No lobby with that id</div>,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
