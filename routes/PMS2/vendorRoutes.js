const express = require("express");
const { createVendorData, getVendorDetails, getAllVendorList, updateVendorData, deleteVendorData, getAllVendorDeleted, updateVendorDetails } = require("../../controllers/PMS2/vendorController");
const { updateVendorValidation, updateArrayOfVendorValidation, addVendorValidation } = require("../../helper/validation");
const router = express.Router();


router.post("/vendor", createVendorData);
router.get("/vendor/:id", getVendorDetails);
router.get("/vendor", getAllVendorList);
router.put("/vendor/:vendor_id", updateArrayOfVendorValidation, updateVendorData);
router.delete("/vendor/:id", deleteVendorData);
router.get("/vendor_deleted", getAllVendorDeleted);
router.put("/vendor_updated/:id", updateVendorValidation, updateVendorDetails)

module.exports = router;
