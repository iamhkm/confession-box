import { Request, Response } from "express";
import { CustomRequest } from "../";

export async function pingController (req: CustomRequest, res: Response) {
    res.send({
        message: "server online"
    });
}