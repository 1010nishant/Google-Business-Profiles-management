import Organization from "../models/organization.js";

// Middleware to authenticate all routes
const authenticate = async (req, res, next) => {
    try {
        const organization = await Organization.findById(req.headers['x-organization-id']);
        req.org = organization;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
};

export { authenticate };