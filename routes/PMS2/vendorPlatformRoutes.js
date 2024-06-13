const express = require("express");
const {
    addVendorPlatform,
    getAllVendorPlatformDetails,
    getSingleVendorPlatformDetails,
    updateSingleVendorPlatformDetails,
    deleteVendorPlatformDetails,
    getAllVendorPlatformDeletedData,
} = require("../../controllers/PMS2/vendorPlatformController");
const { addVendorPlatformValidation, updateVendorPlatformValidation } = require("../../helper/validation");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();

router.post("/vendor_platform", verifyToken, addVendorPlatformValidation, addVendorPlatform);
router.get("/vendor_platform", verifyToken, getAllVendorPlatformDetails);
router.get("/vendor_platform/:id", verifyToken, getSingleVendorPlatformDetails);
router.put("/vendor_platform", verifyToken, updateVendorPlatformValidation, updateSingleVendorPlatformDetails);
router.delete("/vendor_platform/:id", verifyToken, deleteVendorPlatformDetails);
router.get("/vendor_platform_deleted", verifyToken, getAllVendorPlatformDeletedData);

module.exports = router;
