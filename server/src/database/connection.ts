import { Sequelize } from "sequelize";
import database from "../configs/database";

const connection = new Sequelize({
    ...database
});

export default connection;