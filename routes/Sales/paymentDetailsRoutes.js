const express = require("express");
const router = express.Router();
const paymentDetailsController = require("../../controllers/Sales/paymentDetailsController");

/**
 * payment details routes
 */
router.post("/sales/payment_details", paymentDetailsController.createPaymentDetails);
router.get("/sales/payment_details/:id", paymentDetailsController.getPaymentDetails);
router.put("/sales/payment_details/:id", paymentDetailsController.updatePaymentDetails);
router.get("/sales/payment_details", paymentDetailsController.getPaymentDetailList);
router.delete("/sales/payment_details/:id", paymentDetailsController.deletePaymentDetails);

module.exports = router; 