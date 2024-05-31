const express = require("express");
const router = express.Router();
const paymentModeController = require("../../controllers/Sales/paymentModeController");

/**
 * sales payment mode routes
 */
router.post("/sales/payment_mode", paymentModeController.createSalesPaymentmode);
router.put("/sales/payment_mode/:id", paymentModeController.updateSalesPaymentMode);
router.get("/sales/payment_mode/:id", paymentModeController.getSalesPaymentMode);
router.get("/sales/payment_mode", paymentModeController.getSalesPaymentModeList);
router.delete("/sales/payment_mode/:id", paymentModeController.deleteSalesPaymentMode);


module.exports = router; 