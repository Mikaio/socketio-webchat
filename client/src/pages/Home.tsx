import { useLoaderData, Outlet, redirect, useNavigate } from "react-router-dom";

import {
    ArrowLeftOnRectangleIcon as LogoutIcon
} from "@heroicons/react/24/solid";
import { useLayoutEffect } from "react";

export async function homeLoader() {
    const username = localStorage.getItem("@username");

    if (!username)
        return redirect("/login");

    return username;
}



export function Home() {

    const username = useLoaderData() as String;

    const navigate = useNavigate();

    useLayoutEffect(() => {
        navigate("/rooms");
    }, []);

    const logout = () => {
        localStorage.removeItem("@username");

        navigate("/login");
    };

    return (
        <div
            className="w-full h-screen flex flex-col"
        >
            <div
                className="w-full h-18 p-4 bg-zinc-200 text-center flex items-center justify-center"
            >
                <h1>
                    {username}
                </h1>
                <div className="absolute right-6 flex items-center justify-center">
                    <button
                        onClick={logout}
                    >
                        <LogoutIcon className="h6 w-6 text-zinc-600" />
                    </button>
                </div>
            </div>
            <div
                className="flex-1 gap-8 flex-col w-full p-6 flex items-center justify-center"
            >
                <Outlet />
            </div>
        </div>
    );
}
