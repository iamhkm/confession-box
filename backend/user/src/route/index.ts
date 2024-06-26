import express, { Router } from "express";
const router:Router = express.Router();
import { pingRouter } from "./ping";
import { userRouter } from "./user";

router.use("/ping", pingRouter);
router.use("/user", userRouter);

export default router;