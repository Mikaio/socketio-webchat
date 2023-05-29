import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Input } from "../components/Input";
import api from "../services/api";

export async function roomsLoader() {
    try {
        const response = await api.get("/room");

        const rooms = response.data;

        console.log({ rooms });

        return rooms;
    } catch (err) {
        console.log(err);

        return [];
    }
}

type Room =  {
    id: number,
    name: string,
    userId: number,
}

const RoomItem = ({
    name = "",
    onClick = () => {},
}: {
    name: string,
    onClick: () => void,
}) => (
    <div
        className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 px-2 h-20 cursor-pointer"
        onClick={onClick}
    >
        <div className="bg-zinc-300 h-full flex items-center justify-center rounded-md">
            <h2
                className="text-zinc-600 font-bold select-none"
            >
                {name}
            </h2>
        </div>
    </div>
)

export function Rooms() {

    const rooms = useLoaderData() as Room[];

    const navigate = useNavigate();

    const [newRoomName, setNewRoomName] = useState("");
    const [invalidRoomName, setNewInvalidRoomName] = useState(false);

    const changeRoomName= (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event?.target?.value ?? "";

        if (value === "")
            setNewInvalidRoomName(true);
        else if (value !== "" && invalidRoomName)
            setNewInvalidRoomName(false);

        setNewRoomName(value);
    };

    const createRoom = async () => {
        try {
    
            if (newRoomName === "")
                return setNewInvalidRoomName(true);

            const response = await api.post("/room", {
                name: newRoomName,
                userId: 1,
            });

            const newRoom = response.data;

            console.log({ newRoom });

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div
            className="w-full h-full flex flex-col gap-6"
        >
            <div
                className="w-full flex flex-col gap-6 items-center justify-center"
            >
                <h1
                >
                    Create a room or join an existing one
                </h1>
                {
                    invalidRoomName && (
                        <p>
                            Invalid room name
                        </p>
                    )
                }
                <div
                    className="flex flex-row gap-1"
                >
                    <Input
                        value={newRoomName}
                        onChange={changeRoomName}
                    />
                    <button
                        className="w-12 h-auto bg-zinc-300 rounded-xl"
                        onClick={createRoom}
                    >
                        +
                    </button>
                </div>
            </div>
            <div className="px-2 flex-1 flex">
                <div className="flex flex-wrap flex-1 -mx-2">
                    {
                        rooms.map((room) => {

                            const enterRoom = () => navigate(`/rooms/${room.id}`);

                            return (
                                <RoomItem
                                    key={room.id}
                                    name={room.name}
                                    onClick={enterRoom}
                                />
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}
