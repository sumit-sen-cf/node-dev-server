const express = require("express");
const {
  addVendorType,
  getAllVendorTypeDetails,
  getSingleVendorTypeDetails,
  deleteVendorTypeDetails,
  updateSingleVendorTypeDetails,
  getAllVendorTypeDeletedData,
} = require("../../controllers/PMS2/vendorTypeController");
const { addVendorTypeValidation, updateVendorTypeValidation } = require("../../helper/validation");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();

router.post("/vendor_type", verifyToken, addVendorTypeValidation, addVendorType);
router.get("/vendor_type", verifyToken, getAllVendorTypeDetails);
router.get("/vendor_type/:id", verifyToken, getSingleVendorTypeDetails);
router.put("/vendor_type", verifyToken, updateVendorTypeValidation, updateSingleVendorTypeDetails);
router.delete("/vendor_type/:id", verifyToken, deleteVendorTypeDetails);
router.get("/vendor_type_deleted", verifyToken, getAllVendorTypeDeletedData);

module.exports = router;
