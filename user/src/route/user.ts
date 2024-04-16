import express, { Router } from "express";
import { signUp, signIn, getUser } from "../controllers/user";

const router:Router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get("/me", getUser);

export { router as userRouter }