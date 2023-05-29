import {
    RouterProvider,
    createBrowserRouter,
} from "react-router-dom";

import {
    Home,
    homeLoader
} from "./pages/Home"

import { Login } from "./pages/Login";

import {
    Rooms,
    roomsLoader,
} from "./pages/Rooms";

import {
    ViewRoom,
    viewRoomLoader,
} from "./pages/ViewRoom";

const router = createBrowserRouter([
    {
        path: "/",
        id: "root",
        loader: homeLoader,
        element: <Home />,
        children: [
            {
                path: "/rooms",
                element: <Rooms />,
                loader: roomsLoader,
            },
            {
                path: "/rooms/:roomId",
                element: <ViewRoom />,
                loader: viewRoomLoader,
            }
        ]
    },
    {
        path: "login",
        element: <Login />,
    },
]);

export default function Router() {
    return (
        <RouterProvider router={router} />
    );
};
