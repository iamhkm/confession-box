import { createClient } from 'redis';
import { logger } from '..';

export async function connectRedisCache(host:string, port:string, password:string) {
    try{
        const client = createClient({
            url: `redis://${host}:${port}`,
            password: password,
            legacyMode: false,
        });
        client.on('error', (err) => {
            throw new Error(err);
        });
        await client.connect();
        return client;
    }catch(err){
        logger.error("error while connecting redis ", err);
        process.exit(1);
    }
}