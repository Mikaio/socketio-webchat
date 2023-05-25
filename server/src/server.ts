import express from "express";
import { createServer } from "http";
import cors from "cors";
import { startSocketIOServer } from "./services/socket-io";

const app = express();

app.use(express.json());
app.use(cors());

const httpServer = createServer(app);

startSocketIOServer(httpServer);

app.get("/", (_, res) => {
    return res.send("yo");
});

httpServer.listen(3001, () => console.log("server running"));
