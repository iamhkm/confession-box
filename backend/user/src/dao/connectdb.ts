import * as mongoose from 'mongoose';
import { logger } from '..';

export default async function connectDb(mongourl:string, mongodb:string){
    try{
        await mongoose.connect(mongourl, { dbName: mongodb});
    }catch(err){
        logger.error("error connecting db ", err);
        process.exit(1);
    }
}