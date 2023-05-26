import { z } from "zod";

const validator = z.object({
    name: z.string({
        required_error: "The name is required",
    }),
    userId: z.number({
        required_error: "The user ID is required",
    }),
});

export default validator;
