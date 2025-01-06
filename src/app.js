import express from "express";
import rateLimiterMiddleware from "./middleware/rateLimiter.js";
import analyticsRouter from './routes/analyticRoutes.js'
import batchUpdateRouter from './routes/batchUpdateRoutes.js'
import apiMetricRouter from './routes/apiMetricRoutes.js'
import reviewRouter from './routes/reviewRoutes.js'
import { authenticate } from "./middleware/auth.js";

const app = express();

app.use(express.json());

// First apply authentication
app.use(authenticate);

// Rate limiting middleware based on user tier
app.use(rateLimiterMiddleware);

app.use('/analytics', analyticsRouter);
app.use('/review', reviewRouter)
app.use('/batch-update', batchUpdateRouter)
app.use('/api-metric', apiMetricRouter)

export default app;