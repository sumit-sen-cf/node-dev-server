const express = require("express");
const bankNameController = require("../../controllers/PMS2/bankNameController")
const router = express.Router();

router.post("/bank_name", bankNameController.addBankName);
router.get("/bank_name/:id", bankNameController.getSingleBankNameDetails);
router.get("/bank_name", bankNameController.getBankNameList);
router.put("/bank_name/:id", bankNameController.updateBankName);
router.delete("/bank_name/:id", bankNameController.deleteBankName);

module.exports = router;