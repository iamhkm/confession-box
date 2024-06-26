import express, { Router } from "express";
import { pingController } from "../controllers/ping";

const router:Router = express.Router();

router.get("/", pingController);

export { router as pingRouter }