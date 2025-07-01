import { NextFunction, Response, Request } from "express";
import { ZodSchema } from "zod";


export const roomZod = (zodSchema : ZodSchema) => {
    return (req : Request ,res: Response , next : NextFunction) => {
        const result  = zodSchema.safeParse(req.body);
        if(!result.success){
            res.status(400).json({
                status : "failure",
                payload : {
                    message : "Invalid type"
                }
            })
            return;
        };
        next();
    }
}
