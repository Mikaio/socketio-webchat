import { migrate } from "drizzle-orm/mysql2/migrator";
import { db } from ".";

(async () => {
    try {
        await migrate(db, { migrationsFolder: './drizzle' });
        process.exit(0);
    } catch (error) {
        console.log("ERROR MIGRATING:", error);
    }
})();
