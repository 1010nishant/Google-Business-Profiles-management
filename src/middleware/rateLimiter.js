import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis'

import redis from '../config/redis.js';

const TIER_LIMITS = {
    free: 100,
    pro: 1000,
    enterprise: Infinity
};

// Pre-create rate limiters without prefix dependency
const createRateLimiter = (limit) =>
    rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: limit,
        standardHeaders: true,
        store: new RedisStore({
            prefix: 'ratelimit:',
            sendCommand: (command, ...args) => redis.call(command, ...args)
        }),
        skipFailedRequests: false,
        keyGenerator: (req) => req.org?.id || 'unknown-org',
    });

// Initialize rate limiters for each tier
const rateLimiters = {
    free: createRateLimiter(TIER_LIMITS.free),
    pro: createRateLimiter(TIER_LIMITS.pro),
    enterprise: createRateLimiter(TIER_LIMITS.enterprise),
};

// Middleware to dynamically set Redis prefix based on org.id
const rateLimiterMiddleware = async (req, res, next) => {
    const organization = req.org;
    if (!organization || !organization.id || !organization.subscription_tier) {
        return res.status(400).json({ error: 'Organization details are missing.' });
    }
    const subscriptionTier = organization.subscription_tier || 'free';
    const selectedLimiter = rateLimiters[subscriptionTier] || rateLimiters['free'];
    selectedLimiter(req, res, next);
};

export default rateLimiterMiddleware;