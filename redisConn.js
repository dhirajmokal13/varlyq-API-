const redis = require('redis');
const dotenv = require('dotenv').config();
const connectRedis = () => {
    const client = redis.createClient(JSON.parse(process.env.RedisCreddentials));

    (async () => {
        await client.connect();
    })();

    client.on('connect', () => {
        console.log('Redis client connected');
    });

    client.on('error', (error) => {
        console.error(error);
    });
    
    return { client, redis };
}

module.exports = connectRedis;