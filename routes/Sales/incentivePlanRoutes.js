const express = require("express");
const router = express.Router();
const incentivePlanController = require("../../controllers/Sales/incentivePlanController");
const { verifyToken } = require("../../middleware/auth");

/**
 * incentive plan request routes
 */
router.post("/sales/incentive_plan", verifyToken, incentivePlanController.createIncentivePlan);
router.get("/sales/incentive_plan/:id", verifyToken, incentivePlanController.getIncentivePlanDetails);
router.put("/sales/incentive_plan/:id", verifyToken, incentivePlanController.updateIncentivePlan);
router.get("/sales/incentive_plan", verifyToken, incentivePlanController.getIncentivePlanList);
router.delete("/sales/incentive_plan/:id", verifyToken, incentivePlanController.deleteIncentivePlan);

//incentive calculation api's
router.get("/sales/incentive_calculation_status_wise_data/:user_id", verifyToken, incentivePlanController.getIncentiveCalculationStatusWiseData);
router.get("/sales/incentive_calculation_month_wise/:user_id", verifyToken, incentivePlanController.getIncentiveCalculationMonthWise);
router.post("/sales/incentive_calculation_dashboard", verifyToken, incentivePlanController.getIncentiveCalculationDashboard);

router.get("/sales/incentive_relesed_button_data/:user_id", verifyToken, incentivePlanController.getIncentiveReleasedButtonData);
module.exports = router; 