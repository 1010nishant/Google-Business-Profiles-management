import asyncHandler from "../utils/asyncHandler.js";
import ApiError from './../utils/ApiError.js'
import analyticsService from "../services/analyticsService.js";

const getDashboardMetrics = asyncHandler(async (req, res, next) => {
    const metrics = await analyticsService.getDashboardMetrics(req.org.id);
    return res.status(200).json({ metrics, message: "metrics fetched successfully" })
})

export {
    getDashboardMetrics
}