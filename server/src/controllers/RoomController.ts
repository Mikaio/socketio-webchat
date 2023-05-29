import { eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
    db,
    NewRoom,
    rooms,
    users,
} from "../db";
import { sendRoomData } from "../jobs/SendRoomData";

import {
    create as createValidator,
    view as viewValidator,
} from "../validators/roomValidator";

export default class RoomController {
    public async list(req: Request, res: Response) {
        try {

            const rows = await db.select().from(rooms);

            return res.status(StatusCodes.OK).json(rows);
        } catch (err) {
            console.log({ err });

            let message = "Could not list rooms";

            if (err instanceof Error)
                message = err.message
                
            return res.status(StatusCodes.BAD_REQUEST).json({
                message,
            });
        }
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = createValidator.parse(body);

            const roomAlreadyExists = await db
                .select()
                .from(rooms)
                .where(eq(rooms.name, data.name));

            console.log({ roomAlreadyExists });

            if (!!roomAlreadyExists.length) 
                throw new Error("Room already exists");

            const userExists = await db
                .select()
                .from(users)
                .where(eq(users.id, data.userId));

            if (!userExists.length)
                throw new Error("User does not exists");

            await db.insert(rooms).values(data as NewRoom);

            const createdRoom = await db.select().from(rooms).where(eq(rooms.name, data.name)).limit(1);

            return res.status(StatusCodes.CREATED).json(createdRoom[0]);

        } catch (err) {
            console.log({ err });

            let message = "Could not create room";

            if (err instanceof Error)
                message = err.message
                
            return res.status(StatusCodes.BAD_REQUEST).json({
                message,
            });
        }
    }

    public async viewRoom(req: Request, res: Response, next: NextFunction) {
        try {
            const params = req.params;

            const { roomId } = viewValidator.parse(params);

            const room = await db
                .select()
                .from(rooms)
                .where(eq(rooms.id, parseInt(roomId))).limit(1);

            console.log({ room });

            if (!room.length) 
                throw new Error("Room does not exist");

            await sendRoomData(roomId, {
                test: "dale"
            });

            return res.status(StatusCodes.OK).json(room[0]);

        } catch (err) {
            console.log({ err });

            let message = "Could not view room";

            if (err instanceof Error)
                message = err.message
                
            return res.status(StatusCodes.BAD_REQUEST).json({
                message,
            });
        }
    }
}
