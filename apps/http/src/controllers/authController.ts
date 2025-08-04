import { Request, Response } from "express";
import { authZod } from "@repo/common/authzod";
import { prismaClient } from "@repo/db/prismaClient"
import bcrypt from "bcrypt"
import { generateToken } from "@repo/backend-common/JWTHandler"


export const signUp = async (req: Request, res: Response) => {
    try {
        const typeCheck = authZod.safeParse(req.body);
        if (!typeCheck.success) {
            res.status(404).json({
                status: "failure",
                payload: {
                    message: "Invalid type of data passed"
                }
            })
            return;
        }

        const { userName, passwrod } = req.body;

        const ifExist = await prismaClient.user.findFirst({
            where: {
                userName: userName
            }, select: {
                userName: true
            }
        })
        if (ifExist) {
            res.status(400).json({
                status: "failure",
                payload: {
                    message: "username already in use"
                }
            })
            return;
        } else {
            const hashedPassword = await bcrypt.hash(passwrod.trim(), 10);

            const newUser = await prismaClient.user.create({
                data: {
                    userName: userName,
                    passwrod: hashedPassword
                }, select: {
                    userName: true,
                    id: true
                }
            })


            const token = generateToken({ userId: newUser.id });

            res.status(200).json({
                status: "success",
                payload: {
                    "message": "user created successfully",
                    "token": token
                }
            })
            return;
        }

    } catch (e) {
        console.error("Error occured in signin controller\n")
        console.error(e);
        res.status(400).json({
            status: "failure",
            payload: {
                "message": "server issue"
            }
        })
    }
}


export const signIn = async (req: Request, res: Response) => {
    try {
        const typeCheck = authZod.safeParse(req.body);
        if (!typeCheck.success) {
            res.status(404).json({
                status: "failure",
                payload: {
                    message: "Invalid type of data passed"
                }
            })
            return;
        }
        const { userName, passwrod } = req.body;


        const ifExist = await prismaClient.user.findFirst({
            where: {
                userName: userName
            }, select: {
                passwrod: true,
                id: true
            }
        })

        if (!ifExist) {
            res.status(400).json({
                status: "failure",
                payload: {
                    message: "username doesnt exist"
                }
            })
            return;
        } else {
            const verify = await bcrypt.compare(passwrod.trim(), ifExist.passwrod);

            if (verify) {
                const token = generateToken({ userId: ifExist.id });
                res.status(200).json({
                    status: "success",
                    payload: {
                        "message": "signed in successfully",
                        "token": token
                    }
                })

            } else {
                res.status(400).json({
                    status: "failure",
                    payload: {
                        message: "Wrong password or username"
                    }
                })
            }
            return;

        }

    } catch (e) {
        console.error("Error occured in signin controller\n")
        console.error(e);
        res.status(400).json({
            status: "failure",
            payload: {
                "message": "server issue"
            }
        })
    }
}