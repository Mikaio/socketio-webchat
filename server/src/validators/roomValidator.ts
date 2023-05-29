import { z } from "zod";

export const create = z.object({
    name: z.string({
        required_error: "The name is required",
    }),
    userId: z.number({
        required_error: "The user ID is required",
    }),
});


export const view = z.object({
    roomId: z.string({
        required_error: "The room ID is required",
    }),
});
