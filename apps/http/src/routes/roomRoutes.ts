import { Router } from "express";
import { createRoom, joinRoom } from "../controllers/roomController";
import { roomZod } from "../middlewares/zodCheck";
import { createRoomZod , joinRoomZod } from "@repo/common/roomzod";

const router : Router = Router();

router.post('/createroom',roomZod(createRoomZod) ,createRoom);
router.post('/joinroom',roomZod(joinRoomZod), joinRoom);

export default router;