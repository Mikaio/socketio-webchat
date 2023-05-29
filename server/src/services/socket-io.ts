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

        socket.on("give-me-the-listeners", (room) => {
            console.log({ listenersIn: room });

            const size = io.sockets.adapter.rooms.get(room)?.size;

            console.log({ size });

            io.emit("give-me-the-listeners-for-" + room, size);
        });

        socket.on("join", (room) => {
            console.log({ room });
            socket.join(room);
            io.to(room).emit("receive-message", "someone joined");
        });

        socket.on("send-message", (message) => {
            console.log({ message })
            socket.to(message.room).emit("receive-message", message.message);
        })
    });

    io.of("/").adapter.on("create-room", (room) => {
        console.log(`room ${room} was created`);
    });

    io.of("/").adapter.on("join-room", (room, id) => {
        console.log(`socket ${id} has joined room ${room}`);
    });
};

