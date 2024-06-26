const express = require("express");
const { createVendorData, getVendorDetails, getAllVendorList, updateVendorData, deleteVendorData, getAllVendorDeleted, updateVendorDetails, getVendorDetailsBYVendorId } = require("../../controllers/PMS2/vendorController");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();


router.post("/vendor", verifyToken, createVendorData);
router.get("/vendor/:id", verifyToken, getVendorDetails);
router.get("/vendor", getAllVendorList);
router.get('/vendordata/:vendor_id', getVendorDetailsBYVendorId);
router.put("/vendor/:vendor_id", verifyToken, updateVendorData);
router.delete("/vendor/:id", verifyToken, deleteVendorData);
router.get("/vendor_deleted", verifyToken, getAllVendorDeleted);
router.put("/vendor_updated/:id", verifyToken, updateVendorDetails)

module.exports = router;
