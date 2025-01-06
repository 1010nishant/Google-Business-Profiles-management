import reviewService from "../services/reviewService.js";
import asyncHandler from "../utils/asyncHandler.js";

const generateAiResponse = asyncHandler(async (req, res, next) => {
    const response = await reviewService.generateResponse(req.body);
    // Here we can save response if we want to into database
    return res.status(200).json({ response, message: "response generated successfully" })
})

export {
    generateAiResponse
}