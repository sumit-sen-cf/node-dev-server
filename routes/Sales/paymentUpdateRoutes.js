const express = require("express");
const router = express.Router();
const paymentUpdateController = require("../../controllers/Sales/paymentUpdateController");

/**
 * sales booking payment update details routes
 */
router.post("/sales/payment_update", paymentUpdateController.createSalesBookingPayment);
router.put("/sales/payment_update/:id", paymentUpdateController.updateSalesBookingPaymentDeatil);
router.get("/sales/payment_update/:id", paymentUpdateController.getSalesBookingPaymentDetail);
router.get("/sales/payment_update", paymentUpdateController.salesBookingPaymentDetailsList);
router.delete("/sales/payment_update/:id", paymentUpdateController.deleteSalesBookingPaymentDetails);

router.get("/sales/getAll_pending_sales_booking_payment_list", paymentUpdateController.salesBookingPaymentPendingDetailsList);
router.get("/sales/getAll_rejected_sales_booking_payment_list", paymentUpdateController.salesBookingPaymentRejectedDetailsList);



module.exports = router; 