const express = require("express");
const {
    addVendorPlatform,
    getAllVendorPlatformDetails,
    getSingleVendorPlatformDetails,
    updateSingleVendorPlatformDetails,
    deleteVendorPlatformDetails,
    getAllVendorPlatformDeletedData,
} = require("../../controllers/PMS2/vendorPlatformController");
const {
    addVendorPlatformValidation,
    updateVendorPlatformValidation,
} = require("../../helper/validation");
const router = express.Router();

router.post("/vendor_platform", addVendorPlatformValidation, addVendorPlatform);
router.get("/vendor_platform", getAllVendorPlatformDetails);
router.get("/vendor_platform/:id", getSingleVendorPlatformDetails);
router.put(
    "/vendor_platform",
    updateVendorPlatformValidation,
    updateSingleVendorPlatformDetails
);
router.delete("/vendor_platform/:id", deleteVendorPlatformDetails);
router.get("/vendor_platform_deleted", getAllVendorPlatformDeletedData);

module.exports = router;
