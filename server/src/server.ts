import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();

app.use(express.json());
app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("connected")
    
    socket.on("send-this", (message) => {
        console.log("received: ", message);
        socket.broadcast.emit("get-this", message);
    });
});

app.get("/", (_, res) => {
    return res.send("yo");
});

httpServer.listen(3001, () => console.log("server running"));
