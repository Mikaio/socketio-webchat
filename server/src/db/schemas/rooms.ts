import {
    mysqlTable,
    int,
    varchar,
} from "drizzle-orm/mysql-core";
import { InferModel, relations } from "drizzle-orm";
import { users } from "./users";
 
export const rooms = mysqlTable("rooms", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 25 }),
    userId: int("user_id").notNull().references(
        () => users.id,
        {
            onUpdate: "no action",
            onDelete: "cascade"
        }
    ),
});

/* export const roomsRelations = relations(rooms, ({ one }) => ({ */
/*     owner: one(users, { */
/*         fields: [rooms.userId], */
/*         references: [users.id], */
/*     }), */
/* })) */
 
export type Room = InferModel<typeof rooms>;
export type NewRoom = InferModel<typeof rooms, 'insert'>;
