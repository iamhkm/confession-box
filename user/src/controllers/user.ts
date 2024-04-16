import { Response } from "express";
import { UserModel } from "../model/User";
import { addUser, getUserByEmail } from "../dao/user";
import { createHash, createJwtToken } from "../util/commonMethods";
import { logger, redisCacheClient } from "..";
import { CustomRequest } from "..";

export async function signUp (req: CustomRequest, res: Response){
    try{
        const body:JSON = req.body;
        const user = new UserModel(req.body);
        const response = await addUser(user);
        logger.info("user added ", response);
        res.send({message: "user added successfully"});
    }catch(err){
        res.statusCode  = 400;
        res.send({
            message: "error adding user",
            error: err.message
        })
    }
}

export async function signIn(req: CustomRequest, res: Response){
    try{
        interface User {
            email: string;
            password: string;
          }
        const input: User = req.body;
        const passwordHash = createHash(input.password);
        const user = await getUserByEmail(input.email);
        logger.info(`user fetched, ${JSON.stringify(user)}`);
        if (user.password !== passwordHash) throw new Error("invalid username or password");
        if (user.verified === false) throw new Error("Account is not verified yet.");
        if (user.enable === false) throw new Error("Account is disable. Contact admin");
        const token:string = createJwtToken({email: user.email, role: user.role}, 24 * 60 * 60 * 1000);
        await redisCacheClient.hSet(`user:${user.email}`, {
            _id: user._id,
            email: user.email,
            age: user.age,
            gender: user.gender,
            added_date: user.added_date,
            role: user.role
        });
        res.cookie('token', token, {
            // expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true
          });
        res.send({data: "sign in success"});
    }catch(err){
        console.log(err);
        logger.error(err);
        res.statusCode  = 400;
        res.send({
            message: "error logging user",
            error: err.message
        })
    }
}

export async function getUser(req: CustomRequest, res: Response){
    try{
        const user = await redisCacheClient.hGetAll(`user:${req.email}`);
        res.send(user);
    }catch(err){
        res.statusCode  = 400;
        res.send({
            message: "error logging user",
            error: err.message
        })
    }
}