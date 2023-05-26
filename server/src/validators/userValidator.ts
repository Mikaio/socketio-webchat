import { z } from "zod";

const validator = z.object({
    name: z.string({
        required_error: "The name is required",
    }),
});

export default validator;
