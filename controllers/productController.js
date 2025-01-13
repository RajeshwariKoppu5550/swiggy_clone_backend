const express = require('express')
const Firm = require('../models/Firm')
const multer = require('multer')
const Product = require("../models/Product")
const path = require("path"); // Import the path module for handling file extensions
const { console } = require('inspector');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp/my-uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({ storage: storage })
//adding product
const addProduct = async (req, res) => {
    try {
        const { productName, price, category, bestseller, description } = req.body;
        const image = req.file ? req.file.filename : undefined;
        const firmId = req.params.firmid;

        // Fetch the firm by its ID
        const firm = await Firm.findById(firmId);

        if (!firm) {
            console.error("Firm not found with ID:", firmId);
            return res.status(404).json({ error: "Firm not found" });
        }

        // Ensure firm has a products array before pushing to it
        if (!firm.products) {
            console.warn("Firm found, but products array is undefined. Initializing products array.");
            firm.products = []; // Initialize the products array if it's undefined
        }

        // Create a new product instance
        const product = new Product({
            productName,
            price,
            category,
            bestseller,
            description,
            image,
            firm: firm._id,
        });

        // Save the product to the database
        const savedProduct = await product.save();
        console.log("Product saved:", savedProduct);

        // Add the saved product to the firm's products array
        firm.products.push(savedProduct._id);
        console.log("Adding product to firm:", firmId, "Product ID:", savedProduct._id);

        await firm.save(); // Save the updated firm
        console.log("Firm updated successfully:", firmId);

        res.status(200).json(savedProduct); // Return saved product response
    } catch (error) {
        console.error("Error adding product:", error.message); // Log the error
        res.status(500).json({ message: "Internal server error" }); // Return error response
    }
};
const getProductByFirm = async (req, res) => {
    try {
        const firmId = req.params.firmId;

        console.log("Firm ID received:", firmId); // Debugging

        // Fetch the firm and populate its products
        const firm = await Firm.findById(firmId).populate('products'); // Populate products field

        if (!firm) {
            console.log("Firm not found"); // Debugging
            return res.status(404).json({ error: 'No firm found' });
        }

        console.log("Firm found with products:", firm.products); // Debugging

        // Return the firm's products
        res.status(200).json({ products: firm.products });
    } catch (error) {
        console.error("Error in getProductByFirm:", error.message); // Debugging
        res.status(500).json({ message: 'Internal server error' });
    }
};
const deleteProductById = async (req, res) => {
    try {
        const productId = req.params.productId;

        // Attempt to delete the product
        const deleteProduct = await Product.findByIdAndDelete(productId);

        if (!deleteProduct) {
            return res.status(404).json({ error: "No product found" });
        }

        // Successful deletion response
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { addProduct: [upload.single('image'), addProduct], getProductByFirm, deleteProductById };