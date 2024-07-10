const express = require("express");
const router = express.Router();
const financeSalesController = require("../../controllers/Sales/financeSalesController");
const { verifyToken } = require("../../middleware/auth");

/**
 * incentive plan request routes
 */
router.get("/sales/sales_booking_outstanding_for_finanace", verifyToken,
    financeSalesController.getSalesBookingOutStandingListForFinanace);
router.put("/sales/sale_balance_update", verifyToken, financeSalesController.salesBalanceUpdate)
router.get("/sales/php_finance_data_by_id/:cust_id", verifyToken, financeSalesController.getAllphpFinanceDataById)
router.get("/sales/get_sale_booking_tds_data", verifyToken, financeSalesController.saleBookingsForTDS)
router.put("/sales/update_tds_verification", verifyToken, financeSalesController.verifyTDS)

module.exports = router; 