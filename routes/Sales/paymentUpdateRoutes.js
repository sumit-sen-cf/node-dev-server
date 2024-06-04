const express = require("express");
const router = express.Router();
const paymentUpdateController = require("../../controllers/Sales/paymentUpdateController");
const { verifyToken } = require("../../middleware/auth");

/**
 * sales booking payment update details routes
 */
router.post("/sales/payment_update", verifyToken, paymentUpdateController.createPaymentUpdate);
router.put("/sales/payment_update/:id", verifyToken, paymentUpdateController.updatePaymentDeatil);
router.get("/sales/payment_update/:id", verifyToken, paymentUpdateController.getPaymentUpdateDetail);
router.get("/sales/payment_update", verifyToken, paymentUpdateController.paymentUpdateList);
router.delete("/sales/payment_update/:id", verifyToken, paymentUpdateController.deleteBookingPaymentDetails);

router.get("/sales/getAll_pending_sales_booking_payment_list", verifyToken, paymentUpdateController.salesBookingPaymentPendingDetailsList);
router.get("/sales/getAll_rejected_sales_booking_payment_list", verifyToken, paymentUpdateController.salesBookingPaymentRejectedDetailsList);



module.exports = router; 