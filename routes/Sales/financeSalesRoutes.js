const express = require("express");
const router = express.Router();
const financeSalesController = require("../../controllers/Sales/financeSalesController");
const { verifyToken } = require("../../middleware/auth");

/**
 * Finance Api routes
 */
router.get("/sales/sales_booking_outstanding_for_finanace", verifyToken,
    financeSalesController.getSalesBookingOutStandingListForFinanace);
router.put("/sales/sale_balance_update", verifyToken, financeSalesController.salesBalanceUpdate)

// TDS status and amount api's
router.get("/sales/sale_booking_tds_status_wise_data", verifyToken, financeSalesController.saleBookingTdsStatusWiseData)
router.put("/sales/update_tds_verification/:id", verifyToken, financeSalesController.verifyTDS)
router.put("/sales/booking_closed_with_tds_amount/:id", verifyToken, financeSalesController.bookingClosedWithTdsAmount)

module.exports = router; 