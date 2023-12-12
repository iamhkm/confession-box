import { Request, Response } from "express";

export async function pingController (req: Request, res: Response) {
    res.send({
        message: "server online"
    });
}