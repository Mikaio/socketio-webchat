import { eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
    db,
    NewRoom,
    rooms,
    users,
} from "../db";

import roomValidator from "../validators/roomValidator";

export default class RoomController {
    public async list(req: Request, res: Response) {
        try {

            const rows = await db.select().from(rooms);

            return res.status(StatusCodes.OK).json({ rooms: rows });
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

            const data = roomValidator.parse(body);

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

            return res.status(StatusCodes.CREATED).send();

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
}
