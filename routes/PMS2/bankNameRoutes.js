const express = require("express");
const bankNameController = require("../../controllers/PMS2/bankNameController");
const { verifyToken } = require("../../middleware/auth");
const router = express.Router();

router.post("/bank_name", verifyToken, bankNameController.addBankName);
router.get("/bank_name/:id", verifyToken, bankNameController.getSingleBankNameDetails);
router.get("/bank_name", verifyToken, bankNameController.getBankNameList);
router.put("/bank_name/:id", verifyToken, bankNameController.updateBankName);
router.delete("/bank_name/:id", verifyToken, bankNameController.deleteBankName);

module.exports = router;