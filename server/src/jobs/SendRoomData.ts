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
        },
        jobId: "send-room-data",
    });
}

const sendRoomDataWorker = () => {
    const worker = new Worker(
        jobName,
        async (job: Job) => {
            try {
                const name = job.name;
                const data = job.data;

                const server = io("ws://127.0.0.1:3001", {
                    autoConnect: false,
                    transports: ["websocket"]
                });


                const listeners = await new Promise((resolve) => {
                    server.connect();

                    server.on("connect", () => {
                        console.log("connected -", name);
                    });

                    console.log("connected to server")

                    server.emit("give-me-the-listeners", name, (response: number) => {
                        resolve(response);
                    });
                });

                console.log(`${listeners} in room ${name}`);
                if (!listeners) {
                    server.off();
                    server.disconnect();
                    console.log("removing from queue:", name);
                    await sendRoomDataQueue.removeRepeatableByKey(job.repeatJobKey as string);
                    console.log("removed:", name);
                    return;
                }

                server.emit("join", name);

                server.emit("send-job-message", {
                    room: name,
                    message: "hi hi " + name
                }, () => {
                    console.log("message was send to", name);
                    server.off();
                    server.disconnect();
                });
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
    sendRoomDataQueue,
    sendRoomData,
    sendRoomDataWorker,
};
