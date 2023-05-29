import express from "express";
import { createServer } from "http";
import cors from "cors";
import { startSocketIOServer } from "./services/socket-io";
import { sendRoomData } from "./jobs/SendRoomData";
import routes from "./routes";
import errorMiddleware from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

const httpServer = createServer(app);

startSocketIOServer(httpServer);

app.get("/", async (_, res) => {
    await sendRoomData("test", { test: "bruh" });
    return res.send("yo");
});

app.use(errorMiddleware);

httpServer.listen(3001, () => console.log("server running"));
