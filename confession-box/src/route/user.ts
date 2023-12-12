import express, { Router } from "express";
import { signUp } from "../controllers/user";

const router:Router = express.Router();

router.post("/sign-up", signUp);

export { router as userRouter }