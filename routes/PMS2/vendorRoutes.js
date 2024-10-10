const express = require("express");
const { createVendorData, getVendorDetails, getAllVendorList, updateVendorData, deleteVendorData, getAllVendorDeleted, updateVendorDetails, getVendorDetailsBYVendorId, insertBulkVendor, bulkVendorData, getAllVendorsForUsers } = require("../../controllers/PMS2/vendorController");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();
const { upload, upload1 } = require("../../common/uploadFile");

router.post("/vendor", verifyToken, createVendorData);
router.get("/vendor/:id", verifyToken, getVendorDetails);
router.get("/vendor", getAllVendorList);
router.get('/vendordata/:vendor_id', getVendorDetailsBYVendorId);
router.put("/vendor/:vendor_id", verifyToken, updateVendorData);
router.delete("/vendor/:id", verifyToken, deleteVendorData);
router.get("/vendor_deleted", verifyToken, getAllVendorDeleted);
router.put("/vendor_updated/:id", verifyToken, updateVendorDetails)
router.post("/bulk_vendor_post", verifyToken, upload1.single('bulk_vendor_excel'), insertBulkVendor)
router.get("/bulk_vendor_data", verifyToken, bulkVendorData);
router.post("/get_all_vendors_for_users", getAllVendorsForUsers);

module.exports = router;
