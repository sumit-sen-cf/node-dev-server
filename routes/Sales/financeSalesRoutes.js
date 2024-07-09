const express = require("express");
const router = express.Router();
const financeSalesController = require("../../controllers/Sales/financeSalesController");
const { verifyToken } = require("../../middleware/auth");

/**
 * incentive plan request routes
 */
router.get("/sales/sales_booking_outstanding_for_finanace", verifyToken,
    financeSalesController.getSalesBookingOutStandingListForFinanace);

module.exports = router; 