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

    public async signupOrLogin(req: Request, res: Response) {
        try {
            const body = req.body;

            const data = userValidator.parse(body);

            const userAlreadyExists = await db
                .select()
                .from(users)
                .where(eq(users.username, data.username)).limit(1);

            console.log({ userAlreadyExists });

            if (!!userAlreadyExists.length)
                return res.status(200).json(userAlreadyExists[0]);

            await db.insert(users).values(data as NewUser);

            const createdUser = await db
                .select()
                .from(users)
                .where(eq(users.username, data.username)).limit(1);

            return res.status(StatusCodes.CREATED).send(createdUser[0]);

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
