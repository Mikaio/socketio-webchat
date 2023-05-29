import { z } from "zod";

const validator = z.object({
    username: z.string({
        required_error: "The username is required",
    }),
});

export default validator;
