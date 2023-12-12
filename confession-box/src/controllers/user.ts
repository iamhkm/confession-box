import { Request, Response } from "express";
import { UserModel } from "../model/User";
import { addUser } from "../dao/user";

export async function signUp (req: Request, res: Response){
    try{
        const body:JSON = req.body;
        const user = new UserModel(req.body);
        await addUser(user);
        res.send({message: "user added successfully"});
    }catch(err){
        res.statusCode  = 400;
        res.send({
            message: "error adding user",
            error: err.message
        })
    }
}