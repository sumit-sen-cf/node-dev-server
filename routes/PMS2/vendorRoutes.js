const express = require("express");
const { createVendorData, getVendorDetails, getAllVendorList } = require("../../controllers/PMS2/vendorController");
const { upload } = require("../../common/upload");
const router = express.Router();

router.post("/vendor_data", upload, createVendorData);
router.get("/vendor_data/:id",  getVendorDetails);
router.get("/vendor_data",  getAllVendorList);


module.exports = router;
