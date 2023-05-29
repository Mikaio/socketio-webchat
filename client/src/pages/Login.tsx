import { useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { Input } from "../components/Input";
import api from "../services/api";

export function loginLoader() {
    const username = localStorage.getItem("@username");

    if (!!username)
        return redirect("/");

    return null;
}

export function Login() {
    const [enteringUsername, setEnteringUsername] = useState("");
    const [invalidUsername, setInvalidUsername] = useState(false);

    const navigate = useNavigate();

    const changeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event?.target?.value ?? "";

        if (value === "")
            setInvalidUsername(true);
        else if (value !== "" && invalidUsername)
            setInvalidUsername(false);

        setEnteringUsername(value);
    };

    const login = async () => {
        try {
    
            if (enteringUsername === "")
                return setInvalidUsername(true);

            const result = await api.post("/user", {
                username: enteringUsername,
            });

            const newUser = result.data;

            console.log({ newUser });

            localStorage.setItem("@username", enteringUsername);
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-8">
            <h1
                className="uppercase text-zinc-700 font-bold text-xl"
            >
                I hope you remember your username
            </h1>
            <div className="w-3/5">
                <Input
                    label="&#128071;"
                    placeholder="..."
                    value={enteringUsername}
                    onChange={changeUsername}
                    shadowed={true}
                />
            </div>
            {
                invalidUsername && (
                    <p>
                        Invalid Username
                    </p>
                )
            }
            <button
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                onClick={login}
            >
                Enter
            </button>
        </div>
    );
}
