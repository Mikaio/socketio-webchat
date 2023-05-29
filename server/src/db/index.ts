import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import database from "../configs/database";

export * from "./schemas/users";
export * from "./schemas/rooms";
 
const poolConnection = mysql.createPool({
    ...database,
});
 
const db = drizzle(poolConnection);

export {
    db
};
