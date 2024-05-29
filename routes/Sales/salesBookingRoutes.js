const express = require("express");
const router = express.Router();
const Sales = require("../../controllers/Sales/salesBookingController");
const paymentDetailsController = require("../../controllers/SMS/paymentDetailsController");
const salesBookingPayment = require("../../controllers/SMS/salesBookingPaymentController");

router.get("/sales", (req, res) => {
    res.send({ message: "Welcome to Sales module." });
});

/**
 * sales booking routes
 */
router.post("/sales/sales_booking", Sales.addSalesBooking);
router.put("/sales/sales_booking/:id", Sales.editSalesBooking);
router.get("/sales/sales_booking/:id", Sales.getSingleSalesBooking);
router.get("/sales/sales_booking", Sales.getAllSalesBooking);
router.delete("/sales/sales_booking/:id", Sales.deleteSalesBooking);

router.get("/sales/get_all_new_deleted_data", Sales.getNewSalesBooking);
router.get("/sales/get_all_list_sales_booking/:id", Sales.getSalesBookingPaymentDetail);


/**
 * sales booking status routes
 */
router.post("/sales/add_sales_booking_status", Sales.addSalesBookingStatus);

/**
 * sales booking credit approval status Api's
 */
router.get("/sales/credit_approval_status_for_sales_booking_list", Sales.getAllStatusForCreditApprovalSalesBookingList);
router.put("/sales/credit_approval_status_status_change/:id", Sales.editCreditApprovalStatusChange);

/**
 * payment details routes
 */
router.post("/sales/add_payment_details", paymentDetailsController.createPaymentDetails);
router.get("/sales/get_payment_details/:id", paymentDetailsController.getPaymentDetails);
router.put("/sales/update_payment_details/:id", paymentDetailsController.updatePaymentDetails);
router.get("/sales/getlist_payment_details", paymentDetailsController.getPaymentDetailList);
router.delete("/sales/delete_payment_details/:id", paymentDetailsController.deletePaymentDetails);

/**
 * sales booking payment details routes
 */
router.post("/sales/add_sales_booking_payment", salesBookingPayment.createSalesBookingPayment);
router.get("/sales/get_sales_booking_payment/:id", salesBookingPayment.getSalesBookingPaymentDetail);
router.put("/sales/update_sales_booking_payment/:id", salesBookingPayment.updateSalesBookingPaymentDeatil);
router.get("/sales/getlist_sales_booking_payment", salesBookingPayment.salesBookingPaymentDetailsList);
router.delete("/sales/delete_sales_booking_payment_details/:id", salesBookingPayment.deleteSalesBookingPaymentDetails);
router.get("/sales/getAll_pending_sales_booking_payment_list", salesBookingPayment.salesBookingPaymentPendingDetailsList);
router.get("/sales/getAll_rejected_sales_booking_payment_list", salesBookingPayment.salesBookingPaymentRejectedDetailsList);

module.exports = router; 