const vendorController = require('../controllers/vendorController')
const express = require('express');
const router = express.Router();
//to keep in db
//this end point
router.post('/register', vendorController.vendorRegister)
router.post('/login', vendorController.vendorLogin)
router.get('/all-vendors', vendorController.getAllVendors)
router.get("/single-vendor/:id", vendorController.getVendorById)
module.exports = router;