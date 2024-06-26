import { Request } from "express";
import express from "express";
import connectDb from "./dao/connectdb";
import router from "./route/index"
import { 
    MONGO_DB_URI,
    MONGO_DB_NAME,
    REDIS_CACHE_PASSWORD,
    REDIS_CACHE_PORT, 
    REDIS_CACHE_HOST, 
    PORT,
} from "./config/configs";
import { connectRedisCache } from "./dao/rediscache";
import path from "path";
import auth from "./middleware/auth";
import winston from "winston";
import cookieParser from "cookie-parser";

let redisCacheClient:any,
    logger:any;

export interface CustomRequest extends Request {
    email?: string,
    role: string
}
      
    
async function startServer () {

    const date = new Date();

    logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
        return `${timestamp} ${level}: ${message}`;
    })
    ),
    transports: [
        // new winston.transports.Console(), // Log to console
        new winston.transports.File(
            {  
                // filename: `logs/log_${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}.log`
                filename: `logs/log_${date.getFullYear()}${date.getMonth()}${date.getDate()}.log` 
            }
        )
    ],
    });

    const app = express();

    await connectDb(MONGO_DB_URI, MONGO_DB_NAME);
    logger.info("mongo connected");
    redisCacheClient = await connectRedisCache(REDIS_CACHE_HOST, REDIS_CACHE_PORT, REDIS_CACHE_PASSWORD);
    logger.info("redis cache connected");

    app.use(express.json());
    app.use(express.urlencoded({ extended: true}));
    app.use(cookieParser());

    app.use('/static', express.static(path.join(__dirname, 'public')))

    app.use(auth);
    
    app.use("/api", router);
    
    app.listen(PORT, () => {
        logger.info(`server started on port ${PORT}`);
        console.log(`server started on port ${PORT}`);
    });
}

startServer();

export {
    logger,
    redisCacheClient
}