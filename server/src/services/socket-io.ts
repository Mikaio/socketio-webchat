import { Server as SocketIOServer } from "socket.io";

import { Server as HTTPServer } from "http";

export let io: SocketIOServer;

export const startSocketIOServer = (httpServer: HTTPServer) => {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
};