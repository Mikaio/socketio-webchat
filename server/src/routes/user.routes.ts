import { Router } from "express";

import UserController from "../controllers/UserController";

const userController = new UserController();

const userRoutes = Router();

userRoutes.get("/", userController.list);
userRoutes.post("/", userController.signupOrLogin);

export default userRoutes;
