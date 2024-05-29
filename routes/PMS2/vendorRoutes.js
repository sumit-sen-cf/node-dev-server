const express = require("express");
const { createVendorData, getVendorDetails, getAllVendorList, updateVendorData, deleteVendorData, getAllVendorDeleted, updateVendorDetails } = require("../../controllers/PMS2/vendorController");
const { upload } = require("../../common/upload");
const { updateVendorValidation, updateArrayOfVendorValidation, addVendorValidation } = require("../../helper/validation");
const router = express.Router();


router.post("/vendor", addVendorValidation, upload, createVendorData);
router.get("/vendor/:id", getVendorDetails);
router.get("/vendor", getAllVendorList);
router.put("/vendor/:vendor_id", updateArrayOfVendorValidation, upload, updateVendorData);
router.delete("/vendor/:id", deleteVendorData);
router.get("/vendor_deleted", getAllVendorDeleted);
router.put("/vendor_updated/:id", updateVendorValidation, upload, updateVendorDetails)

module.exports = router;
