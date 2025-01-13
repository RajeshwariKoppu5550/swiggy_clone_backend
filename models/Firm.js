const mongoose = require("mongoose");

const firmSchema = new mongoose.Schema({
    firmName: {
        type: String,
        required: true, // Fixed typo
        unique: true,
    },
    area: {
        type: String,
        required: true,
    },
    category: [
        {
            type: String,
            enum: ['veg', 'non-veg'],
        },
    ],
    region: [
        {
            type: String,
            enum: ['south-indian', 'north-indian', 'chinese', 'bakery'],
        },
    ],
    offer: {
        type: String,
    },
    image: {
        type: String,
    },
    vendor: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor', // Ensure it matches the Vendor model
        },
    ],
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
});

const Firm = mongoose.model('Firm', firmSchema); // Uppercase 'F' for consistency
module.exports = Firm;
