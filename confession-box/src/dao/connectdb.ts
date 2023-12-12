import * as mongoose from 'mongoose';

export default async function connectDb(mongourl:string, mongodb:string){
    try{
        await mongoose.connect(mongourl, { dbName: mongodb });
        console.log("database connected")
    }catch(err){
        console.log("error connecting db ", err);
        process.exit(1);
    }
}