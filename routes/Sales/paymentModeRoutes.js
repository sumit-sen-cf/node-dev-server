const express = require("express");
const router = express.Router();
const paymentModeController = require("../../controllers/Sales/paymentModeController");

/**
 * sales payment mode routes
 */
router.post("/sales/payment_mode", paymentModeController.createPaymentmode);
router.put("/sales/payment_mode/:id", paymentModeController.updatePaymentMode);
router.get("/sales/payment_mode/:id", paymentModeController.getPaymentModeDetails);
router.get("/sales/payment_mode", paymentModeController.getPaymentModeList);
router.delete("/sales/payment_mode/:id", paymentModeController.deletePaymentMode);


module.exports = router; 