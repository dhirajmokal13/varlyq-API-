const redis = require('redis');
const dotenv = require('dotenv').config();
const blackList = [];
const redisClient = redis.createClient(JSON.parse(process.env.RedisCreddentials));

(async () => {
    await redisClient.connect();
})();

redisClient.on('connect', () => console.log('Redis client connected'));

redisClient.on('error', error => console.error(error));


module.exports = { redisClient, blackList };