import { Router } from "express";
import { signIn, signUp } from "../controllers/authController";

const router : Router =  Router();

router.post('/signin',signIn);
router.post('/signup', signUp);

export default router;