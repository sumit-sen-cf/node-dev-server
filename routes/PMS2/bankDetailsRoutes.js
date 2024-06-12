const express = require("express");
const { createBankDetails, getBankDetails, getAllBankList, updateBankDetails, getAllBankDataDeleted, deleteBankDetail, getBankDetailsByVendorId } = require("../../controllers/PMS2/bankDetailsController");
const { addBankDetailsValidation, updateBankDetailsValidation } = require("../../helper/validation");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();

router.post("/bank_details", verifyToken, addBankDetailsValidation, createBankDetails);
router.get("/bank_details/:id", verifyToken, getBankDetails);
router.get("/bank_details", verifyToken, getAllBankList);
router.put("/bank_details/:id", verifyToken, updateBankDetailsValidation, updateBankDetails);
router.delete("/bank_details/:id", verifyToken, deleteBankDetail);
router.get("/bank_details_deleted", verifyToken, getAllBankDataDeleted);
router.get("/bank_details_by_vendor_id/:id", verifyToken, getBankDetailsByVendorId);


module.exports = router;
