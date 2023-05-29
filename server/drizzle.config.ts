import type { Config } from "drizzle-kit";
import database from "./src/configs/database";
 
export default {
    schema: "./src/db/schemas/*",
    out: "./drizzle",
    ...database,
    breakpoints: true,
} satisfies Config;
