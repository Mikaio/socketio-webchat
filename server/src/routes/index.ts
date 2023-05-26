import { Router } from "express";

import roomRoutes from "./room.routes";
import userRoutes from "./user.routes";

const routes = Router();

routes.use("/user", userRoutes)
routes.use("/room", roomRoutes);

export default routes;
