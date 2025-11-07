import Redis from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  enableOfflineQueue: false, // recommended for rate-limiter-flexible
});

redisClient.on('error', (err) => {
  // Only log Redis errors once to avoid spam
  if (!global.redisErrorLogged) {
    console.warn('⚠️  Redis not available - caching disabled');
    global.redisErrorLogged = true;
  }
});

export default redisClient;
