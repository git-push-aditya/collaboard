import zod from "zod";
const z = zod;
 

export const createRoomZod = z.object({
    roomName: z.string().min(5).max(20),
    password: z.string().min(5).max(20),
    capacity: z.number()
})

export const joinRoomZod = z.object({
    roomName: z.string().min(5).max(20),
    password: z.string().min(5).max(20)
})


export const addMessageZod = z.object({
    roomId: z.number(),
    message : z.string()
})
