const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/auth");
const paymentUpdateController = require("../../controllers/Sales/paymentUpdateController");

/**
 * sales booking payment update routes
 */
router.post("/sales/payment_update", verifyToken, paymentUpdateController.createSalesBookingPayment);
router.put("/sales/payment_update/:id", verifyToken, paymentUpdateController.updateSalesBookingPaymentDeatil);
router.get("/sales/payment_update/:id", verifyToken, paymentUpdateController.getSalesBookingPaymentDetail);
router.get("/sales/payment_update", verifyToken, paymentUpdateController.salesBookingPaymentDetailsList);
router.delete("/sales/payment_update/:id", verifyToken, paymentUpdateController.deleteSalesBookingPaymentDetails);

router.get("/sales/getAll_pending_sales_booking_payment_list", verifyToken, paymentUpdateController.salesBookingPaymentPendingDetailsList);
router.get("/sales/getAll_rejected_sales_booking_payment_list", verifyToken, paymentUpdateController.salesBookingPaymentRejectedDetailsList);

module.exports = router; 