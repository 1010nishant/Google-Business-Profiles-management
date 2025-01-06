import RedisClient from 'ioredis'
import configuration from '../config/configuration.js';

const config = configuration();

const redis = new RedisClient(config.DATABASE.REDIS_URI);

export default redis