import express from "express";
import { createServer } from "http";
import cors from "cors";
import { startSocketIOServer } from "./services/socket-io";
import { sendRoomData, sendRoomDataQueue } from "./jobs/SendRoomData";
import routes from "./routes";
import errorMiddleware from "./middlewares/error.middleware";
import { io } from "./services/socket-io";
import { createAdapter as createRedisAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { createAdapter as createClusterAdapter } from "@socket.io/cluster-adapter";
import { instrument } from "@socket.io/admin-ui";
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { CommandLineArgs } from "./utils/CommandLineArgs";

const commandLineArgs = CommandLineArgs(process.argv);

console.log({ commandLineArgs });

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

const httpServer = createServer(app);

startSocketIOServer(httpServer);

const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

io.of("/").adapter.on("leave-room", (room, id) => {
  console.log(`socket ${id} has left the room ${room}`);
});

app.get("/", async (_, res) => {
    await sendRoomData("test", { test: "bruh" });
    return res.send("yo");
});

app.use(errorMiddleware);

instrument(io, {
  auth: false,
  mode: "development",
});

if (commandLineArgs.mode === "cluster")
    io.adapter(createClusterAdapter());

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createRedisAdapter(pubClient, subClient));
});


const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullMQAdapter(sendRoomDataQueue)],
  serverAdapter: serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());

process.on("uncaughtException", (err) => {
    console.log(err);
});

process.on("unhandledRejection", (err) => {
    console.log(err);
})

httpServer.listen(3001, () => console.log("server running"));
