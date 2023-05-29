import { useLayoutEffect, useReducer } from "react";
import {
    LoaderFunctionArgs,
    ParamParseKey,
    Params,
    useLoaderData,
    useRouteLoaderData
} from "react-router-dom";
import api from "../services/api";
import { socket } from "../services/socket";

type ViewRoomProps = {
    id: number,
    name: string,
    userId: number,
}

const PathNames = {
    viewRoom: '/rooms/:roomId',
} as const;

interface RoomLoaderArgs extends LoaderFunctionArgs {
  params: Params<ParamParseKey<typeof PathNames.viewRoom>>;
}

export async function viewRoomLoader({ params }: RoomLoaderArgs) {
    try {
        const response = await api.get(`/room/${params.roomId}`);

        const room = response.data;

        return room;
    } catch (error) {
        console.log(error);
    }
}

type Messages = string[];

enum MessagesActionType {
    ADD,
    RESET
}

type MessagesAction = {
    type: MessagesActionType,
    value?: string,
}

const messagesInitialValue: Messages = [];

const reduceMessages = (state: Messages, action: MessagesAction): Messages => {
    switch (action.type) {
        case MessagesActionType.ADD:
            if (!action?.value)
                return state;

            return [...state, action.value];
        case MessagesActionType.RESET:
            return [];
        default:
            return state;
    }
}

export function ViewRoom() {
    const room = useLoaderData() as ViewRoomProps;

    const username = useRouteLoaderData("root");

    const [messages, dispatchMessages] = useReducer(reduceMessages, messagesInitialValue);

    useLayoutEffect(() => {
        if (!socket.connected) {
            console.log("connecting...");
            socket.connect();
            socket.once("connect", () => {
                console.log("connected: ", socket.connected);
            });

            socket.emit("join", `${room.id}`);

            socket.on(`receive-message`, (message) => {
                console.log(message);
            })
        }
        return () => {
            console.log("disconnecting")
            socket.off();
            socket.disconnect();
        };
    }, []);

    const sendMessage = () => {
        console.log("sending message to room " + room.id)
        socket.emit("send-message", {
            room: `${room.id}`,
            message: "hi from " + username,
        });
    }

    return (
        <h1 className="select-none" onClick={sendMessage}>
            {room.name}
        </h1>
    );
}
