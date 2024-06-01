const express = require("express");
const router = express.Router();
const paymentDetailsController = require("../../controllers/Sales/paymentDetailsController");
const { verifyToken } = require("../../middleware/auth");

/**
 * payment details routes
 */
router.post("/sales/payment_details", verifyToken, paymentDetailsController.createPaymentDetails);
router.put("/sales/payment_details/:id", verifyToken, paymentDetailsController.updatePaymentDetails);
router.get("/sales/payment_details/:id", verifyToken, paymentDetailsController.getPaymentDetails);
router.get("/sales/payment_details", verifyToken, paymentDetailsController.getPaymentDetailList);
router.delete("/sales/payment_details/:id", verifyToken, paymentDetailsController.deletePaymentDetails);

module.exports = router; 