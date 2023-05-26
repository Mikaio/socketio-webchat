import { Server as SocketIOServer,  } from "socket.io";

import { Server as HTTPServer } from "http";

export let io: SocketIOServer;

export const startSocketIOServer = (httpServer: HTTPServer) => {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`${socket.id}`);

        socket.on("give-me-the-listeners", (listener, msg) => {
            console.log({ listener, msg });

            const size = io.sockets.adapter.rooms.get("give-me-the-listeners")?.size ?? null;

            console.log({ size });

            io.emit("give-me-the-listeners", `the value of listeners is ${size}`);
        });
    });
};

