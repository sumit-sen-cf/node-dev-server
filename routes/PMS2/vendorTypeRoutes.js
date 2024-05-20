const express = require("express");
const {
  addVendorType,
  getAllVendorTypeDetails,
  getSingleVendorTypeDetails,
  deleteVendorTypeDetails,
  updateSingleVendorTypeDetails,
} = require("../../controllers/PMS2/vendorTypeController");
const {
  addVendorTypeValidation,
  updateVendorTypeValidation,
} = require("../../helper/validation");
const router = express.Router();

router.post("/vendor_type", addVendorTypeValidation, addVendorType);
router.get("/vendor_type", getAllVendorTypeDetails);
router.get("/vendor_type/:id", getSingleVendorTypeDetails);
router.put(
  "/vendor_type",
  updateVendorTypeValidation,
  updateSingleVendorTypeDetails
);
router.delete("/vendor_type/:id", deleteVendorTypeDetails);

module.exports = router;
