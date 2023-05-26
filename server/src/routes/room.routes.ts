import { Router } from "express";

import RoomController from "../controllers/RoomController";

const roomController = new RoomController();

const roomRoutes = Router();

roomRoutes.get("/", roomController.list);
roomRoutes.post("/", roomController.create);

export default roomRoutes;
