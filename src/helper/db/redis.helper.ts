import { Redis} from 'ioredis';
import { RedisOptions } from 'ioredis/built/cluster/util';

const redisConfig : RedisOptions = {
   port: 6379,
   host: process.env.REDIS_HOST || 'localhost',
   username: process.env.REDIS_USER || 'root', 
   password: process.env.REDIS_PASSWORD || 'root',
   db: process.env.REDIS_DB || 0,
}

 const redisClient = new Redis(redisConfig);

 redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis Error:', err);
});


export default redisClient

