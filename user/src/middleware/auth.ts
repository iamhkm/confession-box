import { NextFunction, Response } from "express";
import { newEnforcer, Enforcer } from 'casbin';
import path from "path";
import { logger } from "..";
import { verifyJwtToken } from "../util/commonMethods";
import { CustomRequest } from "../index";


async function auth(req: CustomRequest, res:Response, next: NextFunction) {
    const token = req.cookies.token;
    let sub: string;
    if (!token) {
        req.role = "public";
        sub = "public";
    }
    else {
        try{
            const payload:any = verifyJwtToken(token);
            sub = payload.role;
            req.email = payload.email;
            req.role = payload.role;
        }catch(err){
            logger.error(err.message);
            req.role = "public";
            sub = "public";
        }
    }
    const enforcer: Enforcer = await newEnforcer(path.join(__dirname, 'model.conf'), path.join(__dirname, 'policy.csv'));
    const obj: string = req.url.split("/api/")[1]; // The resource to access
    const act: string = req.method; // The action being requested
    const allowed: boolean = await enforcer.enforce(sub, obj, act);
    if (allowed) {
        next();
    } else {
        res.status(401);
        res.send("not authorized... please login again to continue");
    }
  }

export default auth;