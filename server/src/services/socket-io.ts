import { Server as SocketIOServer,  } from "socket.io";

import { Server as HTTPServer } from "http";

export let io: SocketIOServer;

export const startSocketIOServer = (httpServer: HTTPServer) => {
    io = new SocketIOServer(httpServer, {
        cors: {
            /* origin: "*", */
            /* methods: ["GET", "POST"], */
            origin: ["https://admin.socket.io"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        socket.on("give-me-the-listeners", async (room, callback) => {
            const clientsInRoom = await io.in(room).fetchSockets();

            console.log(clientsInRoom);

            callback(clientsInRoom.length ?? 0);
        });

        socket.on("join", (room) => {
            console.log({ room });
            socket.join(room);
            socket.to(room).emit("receive-message", "someone joined");
        });

        socket.on("send-message", (message) => {
            console.log({ message })
            socket.to(message.room).emit("receive-message", message.message);
        });

        socket.on("send-job-message", (message, callback) => {
            console.log({ message })
            socket.to(message.room).emit("receive-message", message.message);
            callback();
        })
    });

    io.of("/").adapter.on("create-room", (room) => {
        console.log(`room ${room} was created`);
    });

    io.of("/").adapter.on("join-room", (room, id) => {
        console.log(`socket ${id} has joined room ${room}`);
    });
};

