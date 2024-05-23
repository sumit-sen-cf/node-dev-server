const express = require("express");
const { createBankDetails, getBankDetails, getAllBankList, updateBankDetails, getAllBankDataDeleted, deleteBankDetail, getBankDetailsByVendorId } = require("../../controllers/PMS2/bankDetailsController");
const { addBankDetailsValidation, updateBankDetailsValidation } = require("../../helper/validation");
const router = express.Router();

router.post("/bank_details",addBankDetailsValidation, createBankDetails);
router.get("/bank_details/:id", getBankDetails);
router.get("/bank_details", getAllBankList);
router.put("/bank_details/:id",updateBankDetailsValidation, updateBankDetails);
router.delete("/bank_details/:id", deleteBankDetail);
router.get("/bank_details_deleted", getAllBankDataDeleted);
router.get("/bank_details_by_vendor_id/:id", getBankDetailsByVendorId);


module.exports = router;
