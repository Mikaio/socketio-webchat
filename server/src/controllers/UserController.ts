import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import {
    db,

    users,
    User,

    rooms,
    Room,
    NewUser,
} from "../db";

import userValidator from "../validators/userValidator";

export default class UserController {
    public async list(req: Request, res: Response) {
        try {
            const rows = await db
                .select({
                    user: users,
                    room: rooms,
                }).from(users)
                .leftJoin(rooms, eq(users.id, rooms.userId));

            console.log(rows)

            const result = rows.reduce<Record<number, { user: User; rooms: Room[] }>>(
                (acc, row) => {
                    const user = row.user;
                    const room = row.room;

                    if (!acc[user.id]) {
                        acc[user.id] = { user, rooms: [] };
                    }

                    if (room) {
                        acc[user.id].rooms.push(room);
                    }

                    return acc;
                },
                {}
            );

            return res.status(StatusCodes.OK).json({ users: Object.values(result) });
        } catch (err) {
            console.log({ err });

            let message = "Could not list users";

            if (err instanceof Error)
                message = err.message
                
            return res.status(StatusCodes.BAD_REQUEST).json({
                message,
            });
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const body = req.body;

            const data = userValidator.parse(body);

            const userAlreadyExists = await db
                .select()
                .from(users)
                .where(eq(users.username, data.username));

            console.log({ userAlreadyExists });

            if (!!userAlreadyExists.length)
                throw new Error("User already exists");

            await db.insert(users).values(data as NewUser);

            return res.status(StatusCodes.CREATED).send();

        } catch (err) {
            console.log({ err });

            let message = "Could not create user";

            if (err instanceof Error)
                message = err.message
                
            return res.status(StatusCodes.BAD_REQUEST).json({
                message,
            });
        }
    }
}
