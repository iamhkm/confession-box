import 'dotenv/config'

export const MONGO_DB_URI:string = process.env.MONGO_DB_URI;
export const MONGO_DB_NAME:string = process.env.MONGO_DB_NAME;
export const REDIS_CACHE_HOST:string = process.env.REDIS_CACHE_HOST;
export const REDIS_CACHE_PORT:string = process.env.REDIS_CACHE_PORT;
export const REDIS_CACHE_PASSWORD:string = process.env.REDIS_CACHE_PASSWORD;
export const PASSWORD_HASH_SECRET:string = process.env.PASSWORD_HASH_SECRET;
export const JWT_SECRET:string = process.env.JWT_SECRET;
export const PORT:number = Number.isNaN(Number(process.env.PORT)) ? 3000 : Number(process.env.PORT);
export const SESSION_SECRET_KEY:string = process.env.SESSION_SECRET_KEY;