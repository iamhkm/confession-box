import express, { NextFunction, Request, Response } from "express";
import connectDb from "./dao/connectdb";
import { pingRouter, userRouter } from "./route/index"
import { MONGO_DB_URI, MONGO_DB_NAME, REDIS_CACHE_PASSWORD, REDIS_CACHE_PORT, REDIS_CACHE_HOST } from "./config/configs";
import { connectRedisCache } from "./dao/rediscache";
import auth from "./middleware/auth";

let redisCacheClient;

async function startServer () {
    const app = express();

    await connectDb(MONGO_DB_URI, MONGO_DB_NAME);
    redisCacheClient = await connectRedisCache(REDIS_CACHE_HOST, REDIS_CACHE_PORT, REDIS_CACHE_PASSWORD);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true}))

    app.use(auth);
    
    app.use("/api", pingRouter);
    app.use("/api/user", userRouter);
    
    app.listen(3000, () => {
        console.log("app running on port 3000");
    });
}

startServer();