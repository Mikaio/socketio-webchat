import { useState, useEffect, useCallback } from 'react'
import Button from './components/Button'
import { io, Socket } from "socket.io-client";
import axios from "axios";

const SocketMessage: React.FC<{
    message: string,
    ownMessage: boolean,
    index: number
}> = ({ message, ownMessage, index }) => (
    <div className={`${index !== 0 && "mt-1"} w-full flex items-center ${ownMessage ? "justify-end" : "justify-start"}`}>
        <div className="p-2 bg-slate-200 w-1/2 rounded-sm">
            <p className="text-gray-700 text-lg">
                {message}
            </p>
        </div>
    </div>
);

const Loading = () => (
    <div className="bg-gray-200 w-full h-screen flex items-center justify-center">
        <p className="text-lg text-slate-700">
            Loading...
        </p>
    </div>
);

type RandomUserResponse = {
    results: {
        name: {
            title: string,
            first: string,
            last: string,
        }
    }[],
    info: {
        seed: string,
        results: number,
        page: number,
        version: string,
    }
}

let socket: Socket;
function App() {
    const [count, setCount] = useState<Socket>();

    const [socketInstance, setSocketInstance] = useState<Socket>();
    const [userName, setUserName] = useState<string>();
    const [loading, setLoading] = useState(true);
    const [toSendMessage, setToSendMessage] = useState("");
    const [allMessages, setAllMessages] = useState<string[]>([]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const result = await axios.get("https://randomuser.me/api/");

                const data = result.data as RandomUserResponse;            

                setUserName(`${data.results[0].name.first} ${data.results[0].name.last}`);
            } catch (err) {
                alert("Error");
            }
            setLoading(false);
        })();
    }, []);

    const pushMessage = (message: string) => {
        console.log("trying to push", message)
        setAllMessages([...allMessages, message]);
    }

    useEffect(() => {
        console.log("effect");

        const loadSocket = () => {

            socket = io("ws://192.168.88.179:3001");

            socket.on("connect", () => {
                console.log("connected")
            });

            /* socket.emit("get-this", "ayoooo") */
            setSocketInstance(socket);

            socket.on("get-this", (message) => pushMessage(message))
        };

        loadSocket();

        return () => {
            console.log("cleaning");
            if (socket) socket.disconnect();
        };
    }, []);

    const sendMessage = ({ message = `ayo from ${userName}` }: { message: string }) => {
        if (!socketInstance) return;

        console.log("sent new message", message);
        socket.emit("send-this", message);
        pushMessage(message)
    }

    if (loading) return <Loading />

    return (
        <div className="bg-gray-200 w-full h-screen flex items-center justify-center">
            <div className="absolute top-10 mx-auto">
                <p>
                    Your name is <span className="font-bold">{userName}</span>
                </p>
            </div>
            <div
                className="w-1/2 h-3/4 border-solid border-4 border-zinc-700 rounded-md p-1 flex-col gap-1"
            >
                <div
                    className="bg-slate-700 w-full h-5/6 rounded-sm p-1 flex-col gap-1"
                >
                    {
                        (!!allMessages?.length) && allMessages.map((message, index) => (
                            <SocketMessage ownMessage={false} message={message} index={index} key={index} />
                        ))
                    }
                </div>
                <div
                    className="bg-slate-300 w-full h-1/6 rounded-sm flex items-center justify-center"
                >
                    <Button
                        color="primary"
                        onClick={sendMessage}
                    >
                        Hello
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default App
