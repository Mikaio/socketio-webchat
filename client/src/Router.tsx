import * as React from "react";
import {
    RouterProvider,
    createBrowserRouter,
} from "react-router-dom";

import {
    Home,
    homeLoader
} from "./pages/Home"
import { Login } from "./pages/Login";
import { Rooms } from "./pages/Rooms";

const router = createBrowserRouter([
    {
        path: "/",
        loader: homeLoader,
        element: <Home />,
        children: [
            {
                path: "/rooms",
                element: <Rooms />,
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
