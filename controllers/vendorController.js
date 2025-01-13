const Vendor = require('../models/Vendor');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.meandu;

if (!secretKey) {
    console.error("Missing secret key in environment variables");
    process.exit(1); // Exit the application if the secret key is not defined
}
const vendorRegister = async (req, res) => {
    console.log('Request body:', req.body); // Debugging input data
    const { username, email, password } = req.body;

    try {
        // Validate fields
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the email already exists
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) {
            return res.status(400).json({ message: "Email already taken" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new vendor
        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword,
        });

        // Save to the database
        await newVendor.save();
        res.status(201).json({ message: "Vendor registered successfully" });
        console.log('Vendor registered successfully');
    } catch (error) {
        console.error('Error:', error.message, error.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const vendorLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Check if the vendor exists
        const vendor = await Vendor.findOne({ email });
        if (!vendor) {
            return res.status(401).json({ error: "Invalid user or password" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, vendor.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid user or password" });
        }

        // Generate token
        const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: "3h" });

        // Successful login
        res.status(200).json({ success: "Login successful", vendor: { email: vendor.email }, token });
        console.log('Vendor logged in:', email);
    } catch (error) {
        console.error('Error during login:', error.message, error.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const getAllVendors = async (req, res) => {
    try {
        // Fetch vendors with populated firm details
        const vendors = await Vendor.find().populate('firm');

        if (!vendors || vendors.length === 0) {
            return res.status(404).json({ message: 'No vendors found' });
        }

        res.json({ vendors });
    } catch (error) {
        console.error('Error fetching vendors:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const getVendorById = async (req, res) => {
    const vendorId = req.params.id; // Use the correct parameter name
    try {
        // Fetch vendor by ID
        const vendor = await Vendor.findById(vendorId).populate('firm');

        // If vendor not found, return 404 error
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }
        console.log({ vendor })
        // Respond with the vendor details
        res.json({ vendor });
    } catch (error) {
        // Log and handle any errors
        console.error('Error fetching vendor by ID:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};
module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById };
