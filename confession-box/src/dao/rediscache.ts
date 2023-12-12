import { createClient } from 'redis';

export async function connectRedisCache(host:string, port:string, password:string) {
    try{
        const client = createClient({
            url: `redis://${host}:${port}`,
            password: password,
        });
        client.on('error', (err) => console.log('Redis Client Error', err));
        client.on("connect", (res) => console.log("redis connected "));
        const redisClient = await client.connect();
        return redisClient;
    }catch(err){
        console.log("error while connecting redis ", err);
        process.exit(1);
    }
}