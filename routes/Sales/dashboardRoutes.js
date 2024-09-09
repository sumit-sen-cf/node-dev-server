const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/Sales/dashboardController");
const { verifyToken } = require("../../middleware/auth");

/**
 * User Dashboard routes
 */
router.get("/sales/top20_account_list/", verifyToken, dashboardController.getTop20AccountList);
router.get("/sales/weekly_monthly_quarterly_list/", verifyToken, dashboardController.getWeeklyMonthlyQuarterlyList);

//finance dashboard counts
router.get("/sales/finance_dashboard_counts/", verifyToken, dashboardController.financeDashboardCounts);

//Date Range wise total sale booking amount list for the competition
router.get("/sales/date_range_total_sale_amount/", verifyToken, dashboardController.getdateRangeTotalSaleAmountData);

//sale booking status list
router.get("/sales/sale_booking_status_list/", verifyToken, dashboardController.getSaleBookingStatusList);

//sale booking Grid status count list
router.get("/sales/sale_booking_grid_status_count_list/", verifyToken, dashboardController.getSaleBookingGridStatusCountList);

module.exports = router; 