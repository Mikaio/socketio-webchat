import { Request, Response } from "express";
import { request } from "http";
import { StatusCodes } from "http-status-codes";
import { Room, User } from "../database/models";

import userValidator from "../validators/userValidator";

export default class UserController {
    public async list(req: Request, res: Response) {
        try {
            const users = await User.findAndCountAll({
                include: [{
                    model: Room,
                    as: "rooms"
                }],
                order: [["name", "ASC"]],
            });

            return res.status(StatusCodes.OK).json({ users });
        } catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Could not list users",
            });
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const body = req.body;

            const data = userValidator.parse(body);

            const userAlreadyExists = await User.findOne({
                where: {
                    name: data.name,
                }
            });

            if (!!userAlreadyExists)
                throw new Error("User already exists");

            const room = await User.create(data);

            return res.status(StatusCodes.CREATED).json({ room });

        } catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Could not create user",
            });
        }
    }
}
