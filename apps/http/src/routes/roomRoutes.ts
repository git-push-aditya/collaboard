import { Router } from "express";
import { createRoom, joinRoom,allMembers, allChats ,addMessage} from "../controllers/roomController";
import { roomZod } from "../middlewares/zodCheck";
import { createRoomZod , joinRoomZod, addMessageZod } from "@repo/common/roomzod";

const router : Router = Router();

router.post('/createroom',roomZod(createRoomZod) ,createRoom);
router.post('/joinroom',roomZod(joinRoomZod), joinRoom);
router.post('/allmembers', allMembers);
router.post('/pastchats', allChats);
router.post('/addmessage', roomZod(addMessageZod), addMessage);


export default router;