const express = require('express');
const path = require('path'); // Import the path module
const productController = require('../controllers/productController');
const router = express.Router();

// Add a product for a specific firm
router.post('/add-product/:firmid', productController.addProduct);

// Get products by firm ID
router.get('/products/:firmId', productController.getProductByFirm);

// Serve uploaded images
router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, '..', 'uploads', imageName);

    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(404).send('Image not found');
        }
    });
});

// Delete a product by product ID
router.delete('/:productId', productController.deleteProductById);

module.exports = router;
