import { NextFunction, Request, Response } from "express";
import { public_urls } from "../util/constants";

const auth = (req: Request, res:Response, next: NextFunction) => {
    if (public_urls.includes(req.url)) next();
    else {
        res.status(401);
        res.send('unauthorized');
    }
}

export default auth;