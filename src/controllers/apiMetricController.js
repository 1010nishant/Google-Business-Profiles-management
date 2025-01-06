import asyncHandler from "../utils/asyncHandler.js";
import redis from "../config/redis.js";
import { formatTTL } from "../utils/utils.js";

const apiUsage = asyncHandler(async (req, res, next) => {
    const key = `ratelimit:${req.org.id}`;
    // Fetch quota and TTL concurrently
    const [quota, ttl] = await Promise.all([
        redis.get(key),
        redis.ttl(key)
    ]);
    // Determine limit based on subscription tier
    const limit = req.org.subscription_tier === 'free'
        ? 100
        : req.org.subscription_tier === 'pro'
            ? 1000
            : Infinity;

    return res.status(200).json({
        used: parseInt(quota) || 0,
        limit,
        cache_ttl: formatTTL(ttl), // TTL formatted in HH:MM:SS
        remaining: Math.max(0, limit - (parseInt(quota) || 0)),
        message: "metrics fetched successfully"
    })
})

export {
    apiUsage
}