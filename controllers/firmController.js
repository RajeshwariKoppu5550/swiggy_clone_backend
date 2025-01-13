const Firm = require('../models/Firm');
const Vendor = require("../models/Vendor");
const multer = require("multer");
const path = require("path"); // Import the path module for handling file extensions

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

/**
 * Function to add a firm
 */
const addFirm = async (req, res) => {
  try {
    const { firmName, area, category, region, offer } = req.body;
    console.log("Request body:", req.body);
    console.log("Vendor ID:", req.vendorId);

    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image: req.file ? req.file.filename : undefined,
      vendor: vendor._id,
    });

    const savedFirm = await firm.save();
    vendor.firm.push(savedFirm);
    await vendor.save()
    res.status(200).json({ message: "Firm added successfully" });
  } catch (error) {
    console.error("Error adding firm:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }

};
const getFirmById = async (req, res) => {
  const firmId = req.params.id; // Get the firm ID from the route parameter
  try {
    // Fetch the firm by ID
    const firm = await Firm.findById(firmId).populate('vendor');//here along with firm we are getting vendor details also

    // If firm not found, return 404 error
    if (!firm) {
      return res.status(404).json({ error: "Firm not found" });
    }

    // Respond with the firm details
    console.log('Firm Details:', firm);
    res.json({ firm });
    // console.log(res.json({ firm }))
  } catch (error) {
    // Log and handle any errors
    console.error('Error fetching firm by ID:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const deleteFirmById = async (req, res) => {
  try {
    const firmId = req.params.firmId;

    // Attempt to delete the firm
    const deleteFirm = await Firm.findByIdAndDelete(firmId);

    if (!deleteFirm) {
      return res.status(404).json({ error: "No firm found" });
    }

    // Successful deletion response
    res.status(200).json({ message: "Firm deleted successfully" });
  } catch (error) {
    console.error("Error deleting firm:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Export multer upload middleware and the function to add firm
module.exports = {
  addFirm: [upload.single('image'), addFirm], getFirmById, deleteFirmById // Handle file upload and then call addFirm
};
