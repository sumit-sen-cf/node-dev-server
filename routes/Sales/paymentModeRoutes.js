const express = require("express");
const router = express.Router();
const paymentModeController = require("../../controllers/Sales/paymentModeController");
const { verifyToken } = require("../../middleware/auth");

/**
 * sales payment mode routes
 */
router.post("/sales/payment_mode", verifyToken, paymentModeController.createPaymentmode);
router.put("/sales/payment_mode/:id", verifyToken, paymentModeController.updatePaymentMode);
router.get("/sales/payment_mode/:id", verifyToken, paymentModeController.getPaymentModeDetails);
router.get("/sales/payment_mode", verifyToken, paymentModeController.getPaymentModeList);
router.delete("/sales/payment_mode/:id", verifyToken, paymentModeController.deletePaymentMode);


module.exports = router; 