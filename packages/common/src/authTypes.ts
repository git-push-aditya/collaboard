import zod from "zod"

const z = zod;

export const authZod = z.object({
    userName : z.string().min(5).max(20),
    password : z.string().min(5).max(20)
})