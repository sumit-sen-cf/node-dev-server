const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/auth");
const paymentUpdateController = require("../../controllers/Sales/paymentUpdateController");

/**
 * sales booking payment update routes
 */
router.post("/sales/payment_update", verifyToken, paymentUpdateController.createPaymentUpdate);
router.put("/sales/payment_update/:id", verifyToken, paymentUpdateController.updatePaymentDeatil);
router.get("/sales/payment_update/:id", verifyToken, paymentUpdateController.getPaymentUpdateDetail);
router.get("/sales/payment_update", verifyToken, paymentUpdateController.paymentUpdateList);
router.delete("/sales/payment_update/:id", verifyToken, paymentUpdateController.deleteBookingPaymentDetails);

router.get("/sales/payment_update_status_list_data", verifyToken, paymentUpdateController.salesBookingPaymentStatusDetailsList);
router.get("/sales/finance_approval_payment_details", verifyToken, paymentUpdateController.updatePaymentAndSaleData);

module.exports = router; 