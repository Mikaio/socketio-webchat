import {
    int,
    mysqlTable,
    varchar,
} from 'drizzle-orm/mysql-core';
import { InferModel, relations } from 'drizzle-orm';
/* import { rooms } from './rooms'; */
 
export const users = mysqlTable('users', {
    id: int('id').primaryKey().autoincrement(),
    username: varchar('username', { length: 25 }),
});

/* export const usersRelations = relations(users, ({ many }) => ({ */
/*     rooms: many(rooms), */
/* })) */
 
export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, 'insert'>;
