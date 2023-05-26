import { Request, Response } from "express";
import { request } from "http";
import { StatusCodes } from "http-status-codes";
import { Room, User } from "../database/models";

import roomValidator from "../validators/roomValidator";

export default class RoomController {
    public async list(req: Request, res: Response) {
        try {
            const rooms = await Room.findAndCountAll({
                order: [["name", "ASC"]],
            });

            return res.status(StatusCodes.OK).json({ rooms });
        } catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Could not list rooms",
            });
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const body = req.body;

            const data = roomValidator.parse(body);

            const roomAlreadyExists = await Room.findOne({
                where: {
                    name: data.name,
                }
            });

            if (!!roomAlreadyExists) 
                throw new Error("Room already exists");

            const userExists = await User.findOne({
                where: {
                    id: data.userId,
                },
            });

            if (!userExists)
                throw new Error("User does not exists");

            const room = await Room.create(data);

            return res.status(StatusCodes.CREATED).json({ room });

        } catch (err) {
            console.log(err)
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: err.message ??"Could not create room",
            });
        }
    }
}
