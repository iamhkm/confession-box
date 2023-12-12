import 'dotenv/config'

export const MONGO_DB_URI:string = process.env.MONGO_DB_URI;
export const MONGO_DB_NAME:string = process.env.MONGO_DB_NAME;
export const REDIS_CACHE_HOST:string = process.env.REDIS_CACHE_HOST;
export const REDIS_CACHE_PORT:string = process.env.REDIS_CACHE_PORT;
export const REDIS_CACHE_PASSWORD:string = process.env.REDIS_CACHE_PASSWORD;