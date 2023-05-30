import { io } from 'socket.io-client';
import configs from "../configs/configs";

const splitUrl = (url: string) => {

    const http = "http://";
    const https = "https://";

    if (url.startsWith(http))
        return url.split(http)[0];
    else if (url.startsWith(https))
        return url.split(https)[0];
    else
        return url;
}

export const socket = io(`ws://${splitUrl(configs.host)}:${configs.port}`, {
    autoConnect: false,
    transports: ["websocket"]
});
