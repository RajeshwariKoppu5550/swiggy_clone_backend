const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");
dotEnv.config();

const secretKey = process.env.meandu;
const verifyToken = async (req, res, next) => {
    const token = req.headers.token; // Ensure the token is sent in the request headers
    if (!token) {
        return res.status(401).json({ error: "Token is required" });
    }

    try {
        // Decode the token
        const decoded = jwt.verify(token, secretKey);

        // Check if the decoded payload contains `vendorId`
        const vendor = await Vendor.findById(decoded.vendorId); // Use `findById` with `decoded.vendorId`
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }
        // Attach vendorId to the request object
        req.vendorId = vendor._id; // Corrected to vendor._id

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Error in verifyToken middleware:", error);
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};

module.exports = verifyToken;
