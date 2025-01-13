const express = require("express");
const path = require("path"); // Import the path module
const firmController = require('../controllers/firmController');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

// Add a new firm with token verification
router.post('/add-firm', verifyToken, firmController.addFirm);

// Get a single firm by ID
router.get('/single-firm/:id', firmController.getFirmById);

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

// Delete a firm by ID
router.delete('/:firmId', firmController.deleteFirmById);

module.exports = router;
