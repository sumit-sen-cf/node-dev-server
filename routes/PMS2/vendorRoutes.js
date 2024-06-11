const express = require("express");
const { createVendorData, getVendorDetails, getAllVendorList, updateVendorData, deleteVendorData, getAllVendorDeleted, updateVendorDetails } = require("../../controllers/PMS2/vendorController");
const { updateVendorValidation, updateArrayOfVendorValidation, addVendorValidation } = require("../../helper/validation");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();


router.post("/vendor", verifyToken, createVendorData);
router.get("/vendor/:id", verifyToken, getVendorDetails);
router.get("/vendor", verifyToken, getAllVendorList);
router.put("/vendor/:vendor_id", verifyToken, updateArrayOfVendorValidation, updateVendorData);
router.delete("/vendor/:id", verifyToken, deleteVendorData);
router.get("/vendor_deleted", verifyToken, getAllVendorDeleted);
router.put("/vendor_updated/:id", verifyToken, updateVendorValidation, updateVendorDetails)

module.exports = router;
