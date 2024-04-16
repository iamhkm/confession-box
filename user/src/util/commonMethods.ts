import crypto from "node:crypto";
import jwt from 'jsonwebtoken';
const { sign, verify } = jwt;
import {
    PASSWORD_HASH_SECRET,
    JWT_SECRET,
} from "../config/configs"

export function validateEmail(email:string){
    return /^\S+@\S+\.\S+$/.test(email);
}

export function validatePassword(password:string){
    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(password);
}

export function createHash(password:string){
    const hash = crypto.createHmac('sha256', PASSWORD_HASH_SECRET).update(password).digest('hex');
    return hash;
}

export function createJwtToken(payload:any, expiresIn:number){
    try{
        const token = sign(payload, JWT_SECRET, {expiresIn: expiresIn});
        return token;
    }catch(err){
        console.log("error creating jwt token ", err);
        throw new Error("error creating jwt token");
    }
}

export function verifyJwtToken(token: string){
    try{
        const result = verify(token, JWT_SECRET);
        return result;
    }catch(err){
        if (err.constructor.name === "TokenExpiredError"){
            throw new Error("token expired");        
        }
        console.log("error verifying jwt token ", err);
        throw new Error("error verifying jwt token");
    }
}