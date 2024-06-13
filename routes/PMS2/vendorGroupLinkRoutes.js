const express = require("express");
const {
    addVendorGroupLink,
    deleteVendorGroupLinkDetails,
    getAllVendorGroupLinkDetails,
    getSingleVendorGroupLinkDetails,
    updateSingleVendorGroupLinkDetails,
    getAllVendorGroupLinkDeletedData,
    getVendorGroupLinkByVendorId,
} = require("../../controllers/PMS2/vendorGroupLinkController");
const { addVendorGroupLinkValidation, updateVendorGrouplinkValidation } = require("../../helper/validation");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();

router.post("/vendor_group_link", verifyToken, addVendorGroupLinkValidation, addVendorGroupLink);
router.get("/vendor_group_link", verifyToken, getAllVendorGroupLinkDetails);
router.get("/vendor_group_link/:id", verifyToken, getSingleVendorGroupLinkDetails);
router.put("/vendor_group_link", verifyToken, updateVendorGrouplinkValidation, updateSingleVendorGroupLinkDetails);
router.delete("/vendor_group_link/:id", verifyToken, deleteVendorGroupLinkDetails);
router.get("/vendor_group_link_deleted", verifyToken, getAllVendorGroupLinkDeletedData);
router.get("/vendor_group_link_vendor_id/:id", verifyToken, getVendorGroupLinkByVendorId);

module.exports = router;
