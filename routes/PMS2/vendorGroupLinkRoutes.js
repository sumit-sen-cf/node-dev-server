const express = require("express");
const {
    addVendorGroupLink,
    deleteVendorGroupLinkDetails,
    getAllVendorGroupLinkDetails,
    getSingleVendorGroupLinkDetails,
    updateSingleVendorGroupLinkDetails,
} = require("../../controllers/PMS2/vendorGroupLinkController");
const {
    addVendorGroupLinkValidation,
    updateVendorGrouplinkValidation,
} = require("../../helper/validation");
const router = express.Router();

router.post(
    "/vendor_group_link",
    addVendorGroupLinkValidation,
    addVendorGroupLink
);
router.get("/vendor_group_link", getAllVendorGroupLinkDetails);
router.get("/vendor_group_link/:id", getSingleVendorGroupLinkDetails);
router.put(
    "/vendor_group_link",
    updateVendorGrouplinkValidation,
    updateSingleVendorGroupLinkDetails
);
router.delete("/vendor_group_link/:id", deleteVendorGroupLinkDetails);

module.exports = router;
