import { Job, Queue, Worker } from "bullmq";
import { io } from "socket.io-client";

import connection from "../configs/redis";

type RoomData =  {
    test: string;
};

const jobName = "SendRoomData";

const sendRoomDataQueue = new Queue(jobName, { connection });

const sendRoomData = async (name: string, data: RoomData) => {
    console.log(`adding job on send room data with name ${name} and data:`, data);
    await sendRoomDataQueue.add(name, data, {
        repeat: {
            every: 5000,
        }
    });
}

const sendRoomDataWorker = () => {
    const worker = new Worker(
        jobName,
        async (job: Job) => {
            try {
                const name = job.name;
                const data = job.data;

                const server = io("ws://127.0.0.1:3001");

                const listeners = await  new Promise((resolve, reject) => {

                    server.on("connect", () => {
                        console.log("connected");
                    });

                    console.log("connected to server")

                    server.emit("give-me-the-listeners", "sup");

                    server.once("give-me-the-listeners", (message) => {
                        console.log({ message });

                        resolve(message);
                    });
                });

                console.log("after await");

                server.disconnect();

                console.log({ name, data, listeners });
            } catch (error) {
                console.log("ERROR PROCESSING", jobName, error);
            }
        },
        {
            connection,
            concurrency: 10,
        },
    );

    worker.on("ready", () => console.log("send room data is ready to process data"));

    worker.on("completed", (job: Job) => {
        console.log(`${job.queueName} complete the task for ${job.name}`);
    });
};

export {
    sendRoomData,
    sendRoomDataWorker,
};
