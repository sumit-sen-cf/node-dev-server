const express = require("express");
const {
  addVendorBusinessType,
  getAllVendorBusiTypeDetails,
  getSingleVendorBusiTypeDetails,
  deleteVendorBusiTypeDetails,
  updateSingleVendorBusiTypeDetails
} = require("../../controllers/PMS2/vendorBusiTypeController");
// const { addVendorBusinessTypeValidation, updateVendorTypeValidation } = require("../../helper/validation");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();

router.post("/vendor_business_type", verifyToken, addVendorBusinessType);
router.get("/vendor_business_type", verifyToken, getAllVendorBusiTypeDetails);
router.get("/vendor_business_type/:id", verifyToken, getSingleVendorBusiTypeDetails);
router.delete("/vendor_business_type/:id", verifyToken, deleteVendorBusiTypeDetails);
router.put("/vendor_business_type", verifyToken, updateSingleVendorBusiTypeDetails);

module.exports = router;