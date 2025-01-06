import asyncHandler from "../utils/asyncHandler.js";
import batchUpdateService from "../services/batchUpdateService.js";

const updateListing = asyncHandler(async (req, res, next) => {
    try {
        const batch = await batchUpdateService.processBatch(
            req.user.organization_id,
            req.body.listings
        );
        return res.status(200).json({
            batchId: batch.batch_id,
            message: `Processing ${batch.total_listings} listings`,
            status: batch.status
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})

export {
    updateListing
}